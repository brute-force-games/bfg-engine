import { GameLobby, LobbyOptions } from "../../models/p2p-lobby"
import { PlayerProfileId } from "../../models/types/bfg-branded-ids"
import { PublicPlayerProfile } from "../../models/player-profile/public-player-profile"
import { BfgShareableLinkComponent } from "../../ui/components/bfg-shareable-link-component"
import { BfgSupportedGameTitle } from "../../models/game-box-definition"
import { LobbyPlayerJoinGameComponent } from "../../ui/components/lobby-player-join-game-component"
import { Box, Stack, Typography, Chip, Button, Gamepad } from "../bfg-ui"
import { useGameHosting } from "../../hooks/games-registry/game-hosting"
import { PlayerProfileChip } from "./player-profile-chip"


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

  const gameHosting = useGameHosting();
  const baseUrl = gameHosting.getBaseUrl();
  
  const joinLobbyLink = `${baseUrl}/join-lobby/${lobbyState.id}`;

  const gameLink = lobbyState.gameLink;

  if (gameLink) {
    return (
      <LobbyPlayerJoinGameComponent
        lobbyState={lobbyState}
        currentPlayerProfile={currentPlayerProfile}
      />
    )
  }

  const playerPoolChips = lobbyState.playerPool.map(playerProfileId => {
    return (
      <PlayerProfileChip
        playerProfileId={playerProfileId}
        playerProfiles={playerProfiles}
        myPlayerProfile={currentPlayerProfile}
      />
    );
  });
  
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
                style={{ minWidth: 'auto' }}
              >
                {choice}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Player Pool */}
        <Box>
          <Stack direction="row" spacing={1} style={{ alignItems: 'center', marginBottom: '8px' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Player Pool
            </Typography>
            <Typography variant="body2" style={{ color: '#666' }}>
              [{lobbyState.playerPool.length}/{lobbyState.maxNumPlayers}]
            </Typography>
          </Stack>
          
          {/* Seat Management */}
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap style={{ marginBottom: '16px' }}>
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
            {
              playerPoolChips.length > 0 ? 
                playerPoolChips :
                (
                  <Typography variant="body2" style={{ color: '#666', fontStyle: 'italic' }}>
                    No players in pool
                  </Typography>
                ) 
            }
          </Stack>
        </Box>
        
        {/* Join Link */}
        <Box>
          <BfgShareableLinkComponent
            variant="standard"
            linkLabel="Join Lobby Link"
            linkUrl={joinLobbyLink}
            showQrCode={true}
          />
        </Box>
      </Stack>
    </Box>
  )
}
