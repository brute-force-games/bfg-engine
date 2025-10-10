import { GameLobby } from "~/models/p2p-lobby"
// import { createPlayerGameUrl } from "~/router-links"
import { BfgGameTableId, PlayerProfileId } from "~/models/types/bfg-branded-ids"
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile"
import { asHostStartNewGame } from "~/ops/game-table-ops/as-host-start-game"
import { useState } from "react"
import { BfgShareableLinkComponent } from "~/ui/components/bfg-shareable-link-component"
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Chip, 
  Alert,
  CircularProgress
} from "@mui/material"
import { 
  PlayArrow, 
  Clear, 
  PersonRemove, 
  Gamepad,
  Settings
} from "@mui/icons-material"
import { useGameHosting } from "~/hooks/games-registry/game-hosting"
import { useGameRegistry } from "~/hooks/games-registry/games-registry"


interface ILobbyHostStateComponentProps {
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  lobbyState: GameLobby
  updateLobbyState: (lobbyState: GameLobby) => void
  setLobbyPlayerPool: (playerPool: PlayerProfileId[]) => void
  onOpenLobbyOptionsDialog?: () => void
}

export const LobbyHostStateComponent = ({
  playerProfiles,
  lobbyState,
  updateLobbyState,
  setLobbyPlayerPool,
  onOpenLobbyOptionsDialog,
}: ILobbyHostStateComponentProps) => {

  const gameHosting = useGameHosting();
  const gameRegistry = useGameRegistry();
  
  const [isStartingGame, setIsStartingGame] = useState(false);

  const startGame = async () => {
    if (!lobbyState.gameTitle) {
      alert('Please select a game title first');
      return;
    }

    // Prevent multiple calls
    if (isStartingGame) {
      console.log("Game is already starting, ignoring duplicate request");
      return;
    }

    setIsStartingGame(true);
    
    try {
      const newGameTableId = BfgGameTableId.createId();
      
      console.log("starting game", lobbyState);
      const gameTable = await asHostStartNewGame(gameRegistry, lobbyState, newGameTableId);
      console.log("NEW GAME TABLE", gameTable);

      const gameLink = gameHosting.createPlayerGameUrl(newGameTableId);
      updateLobbyState({ ...lobbyState, gameLink, gameTableId: newGameTableId });
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setIsStartingGame(false);
    }
  }

  const playerPoolHandles = lobbyState.playerPool.map(playerId => {
    const playerProfile = playerProfiles.get(playerId);
    if (!playerProfile) {
      return (
        <Chip 
          key={playerId}
          label={`${playerId} (name not available)`}
          variant="outlined"
          color="error"
          size="small"
        />
      );
    }
    return (
      <Chip 
        key={playerId}
        label={playerProfile.handle}
        variant="filled"
        color="primary"
        size="small"
      />
    )
  })

  const isGameStarted = lobbyState.gameLink !== undefined;
  
  const hostingLink = lobbyState.gameTableId ? 
    `${window.location.origin}/hosted-games/${lobbyState.gameTableId}` :
    '';

  const lobbyValidLabel = lobbyState.isLobbyValid ? 
    '[Valid]' :
    '[Invalid]';

  const playerCountLabel = lobbyState.gameTitle === undefined ? 
    '' :
    `[${lobbyState.minNumPlayers} - ${lobbyState.maxNumPlayers} players]`;

  const joinLobbyLink = `${window.location.origin}/join-lobby/${lobbyState.id}`;

  if (isGameStarted) {
    return (
      <Stack spacing={2}>
        <Typography variant="h6" component="h2" gutterBottom>
          <i>{lobbyState.gameTitle}</i> will start once you open the Hosting Link! Players should join using the player link.
        </Typography>

        {(lobbyState.gameLink || hostingLink) && (
          <Box>
            <Stack spacing={1}>
              {lobbyState.gameLink && (
                <BfgShareableLinkComponent
                  variant="standard"
                  linkLabel="Player Game Link"
                  linkUrl={lobbyState.gameLink}
                />
              )}
              {hostingLink && (
                <BfgShareableLinkComponent
                  variant="standard"
                  linkLabel="Hosting Link"
                  linkUrl={hostingLink}
                />
              )}
            </Stack>
            <Box>
              <Typography variant="h6" component="h2" gutterBottom>
                Player Pool
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  [{lobbyState.playerPool.length}/{lobbyState.maxNumPlayers}]
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {playerPoolHandles.length > 0 ? playerPoolHandles : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    No players in pool
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
        )}
      </Stack>
    )
  }


  return (
    <>
      <Stack spacing={2}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="h6" component="h2" gutterBottom>
              {lobbyState.lobbyName}
            </Typography>
            <Chip 
              label={lobbyValidLabel} 
              color={lobbyState.isLobbyValid ? "success" : "error"}
              size="small"
            />
            <Chip 
              label={`${lobbyState.playerPool.length} players`}
              variant="outlined"
              size="small"
            />
          </Stack>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
              hosted by {lobbyState.gameHostPlayerProfile.handle}
            </Typography>
          {!lobbyState.isLobbyValid && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Lobby configuration is invalid. Please check your settings.
            </Alert>
          )}
        </Box>

        {/* Action Buttons */}
        <Box>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              startIcon={isStartingGame ? <CircularProgress size={16} /> : <PlayArrow />}
              onClick={() => startGame()}
              disabled={isGameStarted || isStartingGame || !lobbyState.isLobbyValid}
              color="primary"
              size="large"
            >
              {isStartingGame ? `Starting ${lobbyState.gameTitle}...` : `Start ${lobbyState.gameTitle || 'Game'}`}
            </Button>
          </Stack>
        </Box>

        <BfgShareableLinkComponent
          variant="standard"
          linkLabel="Join Lobby Link"
          linkUrl={joinLobbyLink}
        />

        {/* Player Pool */}
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
            <Typography variant="h6" component="h2">
              Player Pool
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonRemove />}
              onClick={() => setLobbyPlayerPool([])}
              disabled={isGameStarted || lobbyState.playerPool.length === 0}
              color="warning"
              sx={{ minWidth: 'auto', px: 1 }}
            >
              Clear Seats
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              [{lobbyState.playerPool.length}/{lobbyState.maxNumPlayers}]
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {playerPoolHandles.length > 0 ? playerPoolHandles : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                No players in pool
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Game Title */}
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
            <Typography variant="h6" component="h2">
              Game Selection
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Clear />}
              onClick={() => updateLobbyState({ 
                ...lobbyState, 
                gameTitle: undefined,
                isLobbyValid: false,
              })}
              disabled={isGameStarted || !lobbyState.gameTitle}
              color="warning"
              sx={{ minWidth: 'auto', px: 1 }}
            >
              Clear Game
            </Button>
            {onOpenLobbyOptionsDialog && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Settings />}
                onClick={onOpenLobbyOptionsDialog}
                disabled={isGameStarted}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                Configure
              </Button>
            )}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Gamepad sx={{ color: 'primary.main' }} />
            <Typography variant="body1">
              {lobbyState.gameTitle || "No game selected"}
            </Typography>
            {playerCountLabel && (
              <Chip 
                label={playerCountLabel} 
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Box>

        {/* Status Messages */}
        {isGameStarted && (
          <Alert severity="success">
            Game has been started! Players can now join using the game link.
          </Alert>
        )}
      </Stack>
    </>
  )
}
