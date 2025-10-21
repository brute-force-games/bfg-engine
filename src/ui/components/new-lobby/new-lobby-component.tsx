import { z } from 'zod';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { 
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Option,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '../../bfg-ui';
import { useRiskyMyDefaultPlayerProfile } from '../../../hooks/stores/use-my-player-profiles-store';
import { GameLobby } from '../../../models/p2p-lobby';
import { convertPrivateToPublicProfile } from '../../../models/player-profile/utils';
import { useHostedLobbyActions } from '../../../hooks/stores/use-hosted-lobbies-store';
import { BfgGameLobbyId } from '../../../models/types/bfg-branded-ids';
import { BfgSupportedGameTitle, BfgSupportedGameTitleSchema } from '../../../models/game-box-definition';
import { useGameRegistry } from '../../../hooks/games-registry/games-registry';
import { validateLobby } from '~/ops/game-lobby-ops/lobby-utils';
import { Navigate } from '@tanstack/react-router';


// Form validation schema with enhanced Zod validation
const createLobbyFormSchema = z.object({
  lobbyName: z.string()
    .min(1, 'Lobby name is required')
    .max(50, 'Lobby name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_']+$/, 'Lobby name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes')
    .transform((val) => val.trim()),
  gameTitle: BfgSupportedGameTitleSchema
    .optional(),
  joinLobbyAsPlayer: z.boolean(),
});

type CreateLobbyFormData = z.infer<typeof createLobbyFormSchema>;


export const NewLobbyComponent = () => {
  
  const defaultPlayerProfile = useRiskyMyDefaultPlayerProfile();
  
  // Form state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [createdLobbyId, setCreatedLobbyId] = useState<string | null>(null);
  // const [copySuccess, setCopySuccess] = useState<string>('');

  const hostedLobbyActions = useHostedLobbyActions();
  const registry = useGameRegistry();
  // const gameHosting = useGameHosting();

  // Calculate default lobby name (safe even if profile is null)
  const defaultLobbyName = defaultPlayerProfile ? `${defaultPlayerProfile.handle}'s Lobby` : '';

  // TanStack Form with Zod validation - MUST be called before any early returns
  const form = useForm({
    defaultValues: {
      lobbyName: defaultLobbyName,
      joinLobbyAsPlayer: true,
    } as CreateLobbyFormData,
    onSubmit: async ({ value }: { value: CreateLobbyFormData }) => {
      await handleSubmit(value);
    },
  });

  const handleSubmit = async (formData: CreateLobbyFormData) => {
    try {
      // Clear previous messages
      setError('');
      setCreatedLobbyId(null);
      setIsCreating(true);
      
      if (!defaultPlayerProfile) {
        setError('No player profile available');
        return;
      }

      // Validate form data using Zod schema
      const validationResult = createLobbyFormSchema.safeParse(formData);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        setError(firstError.message);
        return;
      }

      const getMinAndMaxNumPlayers = (gameTitle: BfgSupportedGameTitle | undefined) => {
        if (!gameTitle) {
          return {
            minNumPlayers: 1,
            maxNumPlayers: 8,
          };
        }

        const selectedGameMetadata = registry.getGameMetadata(gameTitle);
        return {
          minNumPlayers: selectedGameMetadata.definition.minNumPlayersForGame,
          maxNumPlayers: selectedGameMetadata.definition.maxNumPlayersForGame,
        };
      }

      const { minNumPlayers, maxNumPlayers } = getMinAndMaxNumPlayers(formData.gameTitle);

      const publicHostPlayerProfile = convertPrivateToPublicProfile(defaultPlayerProfile);
      const newLobbyId = BfgGameLobbyId.createId();
      const now = Date.now();

      const newLobby: GameLobby = {
        id: newLobbyId,
        createdAt: now,
        currentStatusDescription: `Launched from ${formData.lobbyName}`,
        lobbyName: formData.lobbyName,
        gameHostPlayerProfile: publicHostPlayerProfile,
        gameTitle: formData.gameTitle,
        playerPool: formData.joinLobbyAsPlayer ? [defaultPlayerProfile.id] : [],
        maxNumPlayers,
        minNumPlayers,
        isLobbyValid: false,
        updatedAt: now,
      };

      const invalidLobbyReasons = validateLobby(registry, newLobby);
      const isLobbyValid = invalidLobbyReasons.length === 0;

      const validatedNewLobby = {
        ...newLobby,
        isLobbyValid,
      } satisfies GameLobby;

      await hostedLobbyActions.addLobby(validatedNewLobby);

      setCreatedLobbyId(newLobbyId);

      form.reset();
      
    } catch (error) {
      console.error('Error creating game table:', error);
      setError('Failed to create game table. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Show loading state if player profile is not loaded
  if (!defaultPlayerProfile) {
    return (
      <Container maxWidth="md" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <Typography variant="h3" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
          Create New Game Lobby
        </Typography>
        <Paper elevation={2} style={{ padding: 24 }}>
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <Typography variant="body1">
              Loading player profile...
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Show lobby creation success if a lobby was just created
  if (createdLobbyId) {
    return (
      <Navigate to="/hosted-lobby/$lobbyId" params={{ lobbyId: createdLobbyId }} />
    )
  }

  const availableGameTitles = registry.getAvailableGameTitles();

  return (
    <Container maxWidth="md" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <Typography variant="h3" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
        Host a Lobby
      </Typography>
      
      <Paper elevation={2} style={{ padding: 24 }}>
        <Typography variant="body1" style={{ marginBottom: 24 }}>
          Create a lobby to invite your friends to join.
        </Typography>
          
        {/* Error Message */}
        {error && (
          <Alert severity="error" style={{ marginBottom: 16 }}>
            {error}
          </Alert>
        )}        
          
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Stack spacing={3}>              
            <form.Field
              name="lobbyName"
              validators={{
                onChange: ({ value }) => {
                  const result = createLobbyFormSchema.shape.lobbyName.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                },
                onBlur: ({ value }) => {
                  // Additional validation on blur for better UX
                  if (value && value.length > 0) {
                    const result = createLobbyFormSchema.shape.lobbyName.safeParse(value);
                    return result.success ? undefined : result.error.errors[0]?.message;
                  }
                  return undefined;
                },
              }}
              children={(field: any) => (
                <TextField
                  label="Lobby Name"
                  placeholder="Enter lobby name..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : ''}
                  fullWidth
                  variant="outlined"
                />
              )}
            />
            <form.Field
              name="gameTitle"
              validators={{
                onChange: ({ value }) => {
                  const result = createLobbyFormSchema.shape.gameTitle.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                },
              }}
              children={(field: any) => (
                <div>
                  <Select
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    label="Game Title"
                    fullWidth
                    error={field.state.meta.errors.length > 0}
                  >
                    <Option value="">Select a game...</Option>
                    {availableGameTitles.map((title) => (
                      <Option key={title} value={title}>
                        {title}
                      </Option>
                    ))}
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <Typography variant="caption" color="error" style={{ marginTop: 4, marginLeft: 14 }}>
                      {field.state.meta.errors[0]}
                    </Typography>
                  )}
                </div>
              )}
            />
            <form.Field
              name="joinLobbyAsPlayer"
              validators={{
                onChange: ({ value }) => {
                  const result = createLobbyFormSchema.shape.joinLobbyAsPlayer.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                },
              }}
              children={(field: any) => (
                <Checkbox
                  checked={field.state.value || false}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  label="Join lobby as player"
                />
              )}
            />
              
            <Stack direction="row" spacing={2} style={{ paddingTop: 16 }}>
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                disabled={isCreating || !form.state.isValid}
                style={{ minWidth: 160 }}
              >
                {isCreating ? 'Creating...' : 'Host Game Lobby'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}
