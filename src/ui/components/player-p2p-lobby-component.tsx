import { 
  Alert,
  Container,
  Groups,
  Paper,
  Typography,
  Wifi} from "../bfg-ui"
import { TabsContainerPanel } from "../bfg-ui"
import { GameLobbyId } from "../../models/types/bfg-branded-ids"
import { useP2pLobby } from "../../hooks/p2p/use-p2p-lobby"
import { PrivatePlayerProfile } from "../../models/player-profile/private-player-profile"
import { P2pConnectionComponent } from "./p2p-connection-component"
import { LobbyPlayerJoinGameComponent } from "./lobby-player-join-game-component"
import { LobbyPlayerStateComponent } from "./lobby-player-state-component"
import { BfgSupportedGameTitle } from "../../models/game-box-definition"
import { JoinLobbyTabId } from "./bfg-tabs"


interface IPlayerP2pLobbyComponentProps {
  lobbyId: GameLobbyId
  playerProfile: PrivatePlayerProfile
  activeTabId: JoinLobbyTabId
}

export const PlayerP2pLobbyComponent = ({
  lobbyId,
  playerProfile,
  activeTabId,
}: IPlayerP2pLobbyComponentProps) => {

  const lobby = useP2pLobby(lobbyId as GameLobbyId, playerProfile);
  console.log('PlayerP2pLobbyComponent: lobby', lobby);

  const { sendPlayerMove } = lobby;

  if (!lobby) {
    return (
      <Container maxWidth="sm" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <Paper elevation={2} style={{ padding: '32px', textAlign: 'center' }}>
          <Typography variant="h6" component="h3" style={{ marginBottom: '8px' }}>
            Connecting to lobby...
          </Typography>
          <Typography variant="body2">
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
      <Container maxWidth="sm" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <Paper elevation={2} style={{ padding: '32px', textAlign: 'center' }}>
          <Typography variant="h6" component="h3" style={{ marginBottom: '8px' }}>
            Connecting to lobby...
          </Typography>
          <Typography variant="body2" style={{ marginBottom: '16px' }}>
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
    <Container maxWidth="lg" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
      <TabsContainerPanel
        activeTabId={activeTabId}
        tabs={[
          {
            title: "Player Lobby",
            id: "player-lobby",
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
            id: "p2p",
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
        // ariaLabel="player lobby tabs"
      />
    </Container>
  )
}
