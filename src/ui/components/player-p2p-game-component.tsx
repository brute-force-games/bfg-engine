import { usePlayerP2pGame } from "../../hooks/p2p/use-player-p2p-game"
import { PrivatePlayerProfile } from "../../models/player-profile/private-player-profile"
import { GameTableId } from "../../models/types/bfg-branded-ids"
import { PlayerGameView } from "../components/player-game-view"
import { Container, TabsContainerPanel } from "../bfg-ui"
import { P2pConnectionComponent } from "./p2p-connection-component"
import { BfgGameSpecificGameState } from "../../models/game-table/game-table-action"
import { PlayerGameTabId } from "./bfg-tabs"
import { PlayerGameDetailsComponent } from "./player-game-details-component"


interface IPlayerP2pGameComponentProps {
  gameTableId: GameTableId
  playerProfile: PrivatePlayerProfile
  activeTabId: PlayerGameTabId
}

export const PlayerP2pGameComponent = ({ gameTableId, playerProfile, activeTabId }: IPlayerP2pGameComponentProps) => {

  const p2pGame = usePlayerP2pGame(gameTableId, playerProfile);

  if (!p2pGame) {
    return <div>Loading P2P Game...</div>;
  }

  const { gameTable, gameActions, myPlayerSeat, sendPlayerMove } = p2pGame;

  if (!gameTable || !gameActions || !myPlayerSeat) {
    console.log("🔍 PlayerP2pGameComponent Debug Info:")
    console.log("  gameTable:", gameTable)
    console.log("  gameActions:", gameActions)
    console.log("  myPlayerSeat:", myPlayerSeat)
    console.log("  connectionStatus:", p2pGame.connectionStatus)
    console.log("  peerCount:", p2pGame.peerProfiles.size)
    console.log("  connectionEvents:", p2pGame.connectionEvents)
    
    return (
      <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
        <TabsContainerPanel<PlayerGameTabId>
          activeTabId={activeTabId}
          tabs={[
            {
              id: "player-game",
              icon: <span>👥</span>,
              content: (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h3>Loading game content...</h3>
                  <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    <div>Connection: {p2pGame.connectionStatus}</div>
                    <div>Peers connected: {p2pGame.peerProfiles.size}</div>
                    {p2pGame.peerProfiles.size === 0 && (
                      <div style={{ marginTop: '10px', color: '#d32f2f' }}>
                        ⚠️ No host detected. Make sure someone is running the game host at:<br/>
                        <code>/hosted-games/{gameTableId}</code>
                      </div>
                    )}
                  </div>
                </div>
              )
            },
            {
              id: "player-game-details",
              icon: <span>📊</span>,
              content: (
                <PlayerGameDetailsComponent
                  // gameTable={gameTable}
                  // gameActions={gameActions}
                />
                // <GameDetailsComponent
                //   gameTable={gameTable}
                //   gameActions={gameActions}
                // />
              )
            },
            {
              id: "player-p2p-game-details",
              icon: <span>📡</span>,
              content: (
                <P2pConnectionComponent
                  connectionStatus={p2pGame.connectionStatus}
                  connectionEvents={p2pGame.connectionEvents}
                  peerProfiles={p2pGame.peerProfiles}
                  playerProfiles={p2pGame.playerProfiles}
                  onRefreshConnection={p2pGame.refreshConnection}
                />
              )
            }
          ]}
          tabColor="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
        />
      </Container>
    );
  }

  const onPlayerGameAction = (move: BfgGameSpecificGameState) => {
    sendPlayerMove(move);
  }


  return (
    <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
      <TabsContainerPanel
        activeTabId={activeTabId}
        tabs={[
          {
            id: "player-game",
            icon: <span>🎮</span>,
            content: (
              <PlayerGameView
                myPlayerProfile={playerProfile}
                myPlayerSeat={myPlayerSeat}
                gameTable={gameTable}
                gameActions={gameActions}
                onPlayerGameAction={onPlayerGameAction}
              />
            )
          },
          {
            id: "player-game-details",
            icon: <span>📊</span>,
            content: (
              <PlayerGameDetailsComponent
                // gameTable={gameTable}
                // gameActions={gameActions}
              />
            )
          },
          {
            id: "player-p2p-game-details",
            icon: <span>📡</span>,
            content: (
              <P2pConnectionComponent
                connectionStatus={p2pGame.connectionStatus}
                connectionEvents={p2pGame.connectionEvents}
                peerProfiles={p2pGame.peerProfiles}
                playerProfiles={p2pGame.playerProfiles}
                onRefreshConnection={p2pGame.refreshConnection}
              />
            )
          }
        ]}
        tabColor="linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
      />
    </Container>
  )
}
