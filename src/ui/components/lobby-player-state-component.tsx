import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { PlayerProfileId } from "~/models/types/bfg-branded-ids"
import { PublicPlayerProfile } from "~/models/player-profile/public-player-profile"
import { BfgShareableLinkComponent } from "~/ui/components/bfg-shareable-link-component"
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Chip,
  Gamepad
} from "bfg-ui-components"
import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile"
import { BfgSupportedGameTitle } from "~/models/game-box-definition"
import { LobbyPlayerJoinGameComponent } from "~/ui/components/lobby-player-join-game-component"


interface ILobbyPlayerStateComponentProps {
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  lobbyState: GameLobby
  currentPlayerProfile: PublicPlayerProfile
  lobbyOptions: LobbyOptions

  onSelectGameChoice: (gameChoice: BfgSupportedGameTitle) => void
  onTakeSeat: () => void
  onLeaveSeat: () => void
}

export const LobbyPlayerStateComponent = ({
  playerProfiles,
  lobbyState,
  currentPlayerProfile,
  lobbyOptions,
  onSelectGameChoice,
  onTakeSeat,
  onLeaveSeat,
}: ILobbyPlayerStateComponentProps) => {

  const hostProfile = lobbyState.gameHostPlayerProfile as PublicPlayerProfile;

  const playerRangeLabel = lobbyState.minNumPlayers === lobbyState.maxNumPlayers ? 
    `${lobbyState.minNumPlayers} players` :
    `${lobbyState.minNumPlayers} - ${lobbyState.maxNumPlayers} players`;

  
  const joinLobbyLink = `${window.location.origin}/join-lobby/${lobbyState.id}`;

  const getPlayerProfile = (playerId: PlayerProfileId) => {
    const playerProfile = playerProfiles.get(playerId);
    if (playerProfile) {
      return playerProfile;
    }

    if (currentPlayerProfile.id === playerId) {
      return currentPlayerProfile;
    }

    return playerProfile;
  }

  const gameLink = lobbyState.gameLink;

  if (gameLink) {
    return (
      <LobbyPlayerJoinGameComponent
        lobbyState={lobbyState}
        currentPlayerProfile={currentPlayerProfile}
      />
    )
  }
  
  return (
    <Box>
      <Stack spacing={2}>
        {/* Lobby Status */}
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="h6" component="h2" gutterBottom>
              {lobbyState.lobbyName}
            </Typography>
            <Chip 
              label={`${lobbyState.playerPool.length} players`}
              variant="outlined"
              size="small"
            />
          </Stack>
          <Typography variant="body2" gutterBottom style={{ fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.6)' }}>
            hosted by {hostProfile.handle}
          </Typography>
        </Box>

        {/* Game Selection */}
        <Box>
          <Typography variant="h6" component="h2" gutterBottom>
            Game Selection
          </Typography>
          <Stack direction="row" spacing={1} style={{ marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Gamepad />
            <Typography variant="body1">
              {lobbyState.gameTitle || "No game selected"}
            </Typography>
            {lobbyState.gameTitle && (
              <Chip 
                label={`${playerRangeLabel}`}
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
          
          {/* Game Choice Buttons */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {lobbyOptions.gameChoices.map(choice => (
              <Button
                key={choice}
                variant={lobbyState.gameTitle === choice ? "contained" : "outlined"}
                size="small"
                onClick={() => onSelectGameChoice(choice)}
                sx={{ minWidth: 'auto' }}
              >
                {choice}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Player Pool */}
        <Box>
          <Typography variant="h6" component="h2" gutterBottom>
            Player Pool
          </Typography>
          <Stack direction="row" spacing={1} style={{ alignItems: 'center', marginBottom: '8px' }}>
            <Typography variant="body2" style={{ color: '#666' }}>
              [{lobbyState.playerPool.length}/{lobbyState.maxNumPlayers}]
            </Typography>
          </Stack>
          
          {/* Seat Management */}
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            <Button
              variant="contained"
              size="small"
              onClick={onTakeSeat}
              disabled={lobbyState.playerPool.length >= lobbyState.maxNumPlayers || lobbyState.playerPool.includes(currentPlayerProfile.id)}
              color="primary"
            >
              Take Seat
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onLeaveSeat}
              disabled={!lobbyState.playerPool.includes(currentPlayerProfile.id)}
              color="secondary"
            >
              Leave Seat
            </Button>
          </Stack>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {lobbyState.playerPool.map(playerId => {
              const playerProfile = getPlayerProfile(playerId);
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
              const isCurrentPlayer = playerId === playerProfile.id;
              return (
                <Chip 
                  key={playerId}
                  label={playerProfile.handle}
                  variant={isCurrentPlayer ? "filled" : "outlined"}
                  color={isCurrentPlayer ? "primary" : "default"}
                  size="small"
                />
              );
            })}
            {lobbyState.playerPool.length === 0 && (
              <Typography variant="body2" style={{ color: '#666', fontStyle: 'italic' }}>
                No players in pool
              </Typography>
            )}
          </Stack>
        </Box>
        
        {/* Join Link */}
        <Box>
          <BfgShareableLinkComponent
            variant="standard"
            linkLabel="Join Lobby Link"
            linkUrl={joinLobbyLink}
          />
        </Box>
      </Stack>
    </Box>
  )
}
