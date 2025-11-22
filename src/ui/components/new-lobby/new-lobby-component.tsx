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
import { convertPrivateToPublicProfile } from '../../../models/internal/player-profile/utils';
import { useHostedLobbyActions } from '../../../hooks/stores/use-hosted-lobbies-store';
import { BfgGameInstanceIdToolbox, BfgGameLobbyIdToolbox } from '../../../models/types/bfg-branded-uuids';
import { BfgSupportedGameTitle, BfgSupportedGameTitleSchema } from '../../../models/game-box-definition';
import { useGameRegistry } from '../../../hooks/games-registry/games-registry-hook';
import { validateLobby } from '@bfg-engine/ops/game-lobby-ops/lobby-utils';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { doStartGame } from '../lobby/start-game-utils';
import { useSiteHosting } from '../../../hooks/site-hosting';
import { updateHostedLobby } from '../../../tb-store/hosted-lobbies-store';


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


interface NewLobbyComponentProps {
  defaultGameTitle?: string;
}

export const NewLobbyComponent = ({ defaultGameTitle }: NewLobbyComponentProps) => {
  
  const defaultPlayerProfile = useRiskyMyDefaultPlayerProfile();
  
  // Form state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isLaunchingSolo, setIsLaunchingSolo] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [createdLobbyId, setCreatedLobbyId] = useState<string | null>(null);
  // const [copySuccess, setCopySuccess] = useState<string>('');

  const hostedLobbyActions = useHostedLobbyActions();
  const registry = useGameRegistry();
  const navigate = useNavigate();
  const siteHosting = useSiteHosting();
  // const gameHosting = useGameHosting();

  // Calculate default lobby name (safe even if profile is null)
  const defaultLobbyName = defaultPlayerProfile ? `${defaultPlayerProfile.handle}'s Table` : '';

  const availableGameTitles = registry.getAvailableGameTitles();
  const inititalGameTitle = defaultGameTitle || (availableGameTitles.length === 1 ? availableGameTitles[0] : undefined);


  // TanStack Form with Zod validation - MUST be called before any early returns
  const form = useForm({
    defaultValues: {
      lobbyName: defaultLobbyName,
      gameTitle: inititalGameTitle,
      joinLobbyAsPlayer: true,
    } as CreateLobbyFormData,
    onSubmit: async ({ value }: { value: CreateLobbyFormData }) => {
      await handleSubmit(value);
    },
  });

  // Handle game title changes and update URL
  const handleGameTitleChange = (gameTitle: string) => {
    navigate({
      to: '/new-lobby',
      search: {
        gameTitle: gameTitle || undefined,
      },
    });
  };

  const getMinAndMaxNumPlayers = (gameTitle: BfgSupportedGameTitle | undefined): { minNumPlayers: number; maxNumPlayers: number } | null => {
    if (!gameTitle) {
      return null;
    }

    const selectedGameMetadata = registry.getGameMetadata(gameTitle);
    return {
      minNumPlayers: selectedGameMetadata.definition.minNumPlayersForGame,
      maxNumPlayers: selectedGameMetadata.definition.maxNumPlayersForGame,
    };
  }

  const isSoloPlayEnabled = () => {
    const formData = form.state.values;
    if (!formData.gameTitle) {
      return false;
    }
    const playerCounts = getMinAndMaxNumPlayers(formData.gameTitle);
    if (playerCounts === null) {
      return false;
    }
    return playerCounts.minNumPlayers === 1;
  };

  const handleSoloPlay = async () => {
    try {
      // Clear previous messages
      setError('');
      setCreatedLobbyId(null);
      setIsLaunchingSolo(true);
      
      if (!defaultPlayerProfile) {
        setError('No player profile available');
        return;
      }

      const formData = form.state.values;

      // Validate that a game is selected
      if (!formData.gameTitle) {
        setError('Please select a game first');
        return;
      }

      // Validate that the game supports solo play
      if (!isSoloPlayEnabled()) {
        setError('This game does not support solo play');
        return;
      }

      // Validate lobby name
      const lobbyNameValidation = createLobbyFormSchema.shape.lobbyName.safeParse(formData.lobbyName);
      if (!lobbyNameValidation.success) {
        const firstError = lobbyNameValidation.error.issues[0];
        setError(firstError.message);
        return;
      }

      const playerCounts = getMinAndMaxNumPlayers(formData.gameTitle);
      if (playerCounts === null) {
        setError('Please select a game first');
        return;
      }

      const { minNumPlayers, maxNumPlayers } = playerCounts;

      const publicHostPlayerProfile = convertPrivateToPublicProfile(defaultPlayerProfile);
      const newLobbyId = BfgGameLobbyIdToolbox.createRandomId();
      const newInstanceId = BfgGameInstanceIdToolbox.createRandomId();
      const now = Date.now();

      // For solo play, always include the player in the pool
      const playerPool = [defaultPlayerProfile];

      const newLobby: GameLobby = {
        id: newLobbyId,
        gameInstanceId: newInstanceId,
        currentStatusDescription: `Solo play launched from ${formData.lobbyName}`,
        lobbyName: formData.lobbyName,
        gameHostPlayerProfile: publicHostPlayerProfile,
        gameTitle: formData.gameTitle,
        playerPool,
        maxNumPlayers,
        minNumPlayers,
        isLobbyValid: false,
        createdAt: now,
        updatedAt: now,
      };

      const invalidLobbyReasons = validateLobby(registry, newLobby);
      const isLobbyValid = invalidLobbyReasons.length === 0;

      const validatedNewLobby = {
        ...newLobby,
        isLobbyValid,
      } satisfies GameLobby;

      // Add lobby to store first so updateLobbyState can work
      await hostedLobbyActions.addLobby(validatedNewLobby);

      const updateLobbyState = (lobbyState: GameLobby) => {
        updateHostedLobby(validatedNewLobby.id, lobbyState);
      }

      const doStartGameResult = await doStartGame(validatedNewLobby, registry, siteHosting, updateLobbyState);
      

      if (!doStartGameResult) {
        setError('Failed to start game. Please try again.');
        return;
      }
      
      // Navigate with autoStart parameter for solo play
      // Don't set createdLobbyId since we're navigating manually with search params
      navigate({
        to: '/hosted-lobby/$lobbyId',
        params: { lobbyId: newLobbyId },
        search: { autoStart: true },
      });
      
    } catch (error) {
      console.error('Error launching solo play:', error);
      setError('Failed to launch solo play. Please try again.');
    } finally {
      setIsLaunchingSolo(false);
    }
  };

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
        const firstError = validationResult.error.issues[0];
        setError(firstError.message);
        return;
      }

      const playerCounts = getMinAndMaxNumPlayers(formData.gameTitle);
      if (playerCounts === null) {
        setError('Please select a game first');
        return;
      }

      const { minNumPlayers, maxNumPlayers } = playerCounts;

      const publicHostPlayerProfile = convertPrivateToPublicProfile(defaultPlayerProfile);
      const newLobbyId = BfgGameLobbyIdToolbox.createRandomId();
      const newInstanceId = BfgGameInstanceIdToolbox.createRandomId();

      const now = Date.now();

      const playerPool = formData.joinLobbyAsPlayer ? [defaultPlayerProfile] : [];

      const newLobby: GameLobby = {
        id: newLobbyId,
        gameInstanceId: newInstanceId,
        currentStatusDescription: `Launched from ${formData.lobbyName}`,
        lobbyName: formData.lobbyName,
        gameHostPlayerProfile: publicHostPlayerProfile,
        gameTitle: formData.gameTitle,
        playerPool,
        maxNumPlayers,
        minNumPlayers,
        isLobbyValid: false,
        createdAt: now,
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
                  return result.success ? undefined : result.error.issues[0]?.message;
                },
                onBlur: ({ value }) => {
                  // Additional validation on blur for better UX
                  if (value && value.length > 0) {
                    const result = createLobbyFormSchema.shape.lobbyName.safeParse(value);
                    return result.success ? undefined : result.error.issues[0]?.message;
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
                  return result.success ? undefined : result.error.issues[0]?.message;
                },
              }}
              children={(field: any) => (
                <div>
                  <Select
                    value={field.state.value || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      field.handleChange(newValue);
                      handleGameTitleChange(newValue);
                    }}
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
                  return result.success ? undefined : result.error.issues[0]?.message;
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
                disabled={isCreating || isLaunchingSolo || !form.state.isValid}
                style={{ minWidth: 160 }}
              >
                {isCreating ? 'Creating...' : 'Host Game Lobby'}
              </Button>
              <Button 
                type="button"
                variant="outlined"
                color="primary"
                disabled={isCreating || isLaunchingSolo || !isSoloPlayEnabled()}
                onClick={handleSoloPlay}
                style={{ minWidth: 160 }}
              >
                {isLaunchingSolo ? 'Launching...' : 'Launch Solo Play'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}
