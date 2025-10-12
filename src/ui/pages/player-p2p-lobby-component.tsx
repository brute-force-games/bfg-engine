import { 
  Typography, 
  Container,
  Paper,
  Alert,
  TabsContainerPanel,
  Groups,
  Wifi
} from "bfg-ui-components"

// Simple loading spinner component
const LoadingSpinner = () => (
  <div style={{
    width: '48px',
    height: '48px',
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #1976d2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  }}>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);
// import { BfgGameLobbyId } from "@bfg-engine/models/types/bfg-branded-ids"
import { useP2pLobby } from "~/hooks/p2p/use-p2p-lobby"
// import { PrivatePlayerProfile } from "@bfg-engine/models/player-profile/private-player-profile"
import { P2pConnectionComponent } from "../components/p2p-connection-component"
// import { BfgSupportedGameTitles } from "@bfg-engine/models/types/bfg-game-engines/supported-games"
import { LobbyPlayerJoinGameComponent } from "../components/lobby-player-join-game-component"
import { LobbyPlayerStateComponent } from "../components/lobby-player-state-component"
import { GameLobbyId } from "~/models/types/bfg-branded-ids"
import { PrivatePlayerProfile } from "~/models/player-profile/private-player-profile"
import { convertPrivateToPublicProfile } from "~/models/player-profile/utils"
import { BfgSupportedGameTitle } from "~/models/game-box-definition";


interface IPlayerP2pLobbyComponentProps {
  lobbyId: GameLobbyId
  playerProfile: PrivatePlayerProfile
}

export const PlayerP2pLobbyComponent = ({
  lobbyId,
  playerProfile,
}: IPlayerP2pLobbyComponentProps) => {

  const publicPlayerProfile = convertPrivateToPublicProfile(playerProfile);
  const lobby = useP2pLobby(lobbyId as GameLobbyId, publicPlayerProfile);
  console.log('PlayerP2pLobbyComponent: lobby', lobby);

  const { sendPlayerMove } = lobby;

  if (!lobby) {
    return (
      <Container maxWidth="sm" style={{ padding: '64px 0' }}>
        <Paper elevation={2} style={{ padding: '32px', textAlign: 'center' }}>
          <LoadingSpinner />
          <Typography variant="h6" component="h3" style={{ marginBottom: '8px' }}>
            Connecting to lobby...
          </Typography>
          <Typography variant="body2" color="secondary">
            Please wait while we establish the connection.
          </Typography>
        </Paper>
      </Container>
    )
  }

  const lobbyState = lobby.lobbyDetails?.lobbyState;
  const lobbyOptions = lobby.lobbyDetails?.lobbyOptions;

  const onSelectGameChoice = (gameChoice: BfgSupportedGameTitle) => {
    sendPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice });
  }
  const onTakeSeat = () => {
    sendPlayerMove({ move: 'take-seat' });
  }
  const onLeaveSeat = () => {
    sendPlayerMove({ move: 'leave-seat' });
  }

  console.log('PlayerP2pLobbyComponent: lobbyState', lobbyState);
  console.log('PlayerP2pLobbyComponent: lobbyOptions', lobbyOptions);

  if (!lobbyState || !lobbyOptions) {
    return (
      <Container maxWidth="sm" style={{ padding: '64px 0' }}>
        <Paper elevation={2} style={{ padding: '32px', textAlign: 'center' }}>
          <LoadingSpinner />
          <Typography variant="h6" component="h3" style={{ marginBottom: '8px' }}>
            Connecting to lobby...
          </Typography>
          <Typography variant="body2" color="secondary" style={{ marginBottom: '16px' }}>
            Make sure the host has started the lobby. Please wait while we establish the connection.
          </Typography>
          <Alert severity="info" style={{ textAlign: 'left' }}>
            Waiting for lobby data from the host.
          </Alert>
        </Paper>
      </Container>
    )
  }

  const gameLink = lobbyState.gameLink;

  if (gameLink) {
    return (
      <LobbyPlayerJoinGameComponent
        lobbyState={lobbyState}
        currentPlayerProfile={playerProfile}
      />
    )
  }


  return (
    <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
      <TabsContainerPanel
        tabs={[
          {
            title: "Player Lobby",
            icon: <Groups />,
            content: (
              <LobbyPlayerStateComponent
                playerProfiles={lobby.playerProfiles}
                lobbyState={lobbyState}
                currentPlayerProfile={playerProfile}
                lobbyOptions={lobbyOptions}
                onSelectGameChoice={onSelectGameChoice}
                onTakeSeat={onTakeSeat}
                onLeaveSeat={onLeaveSeat}
              />
            )
          },
          {
            title: "P2P",
            icon: <Wifi />,
            content: (
              <P2pConnectionComponent
                connectionStatus={lobby.connectionStatus}
                connectionEvents={lobby.connectionEvents}
                peerProfiles={lobby.peerProfiles}
                playerProfiles={lobby.playerProfiles}
                onRefreshConnection={lobby.refreshConnection}
              />
            )
          }
        ]}
        tabColor="linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
        ariaLabel="player lobby tabs"
      />
    </Container>
  )
}
