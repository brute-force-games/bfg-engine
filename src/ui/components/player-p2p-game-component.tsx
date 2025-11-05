// import { useGameRegistry } from "~/hooks/games-registry/games-registry"
// import { usePlayerP2pGame } from "../../hooks/p2p/game/use-player-p2p-game"
// import { PrivatePlayerProfile } from "../../models/player-profile/private-player-profile"
// import { GameTableId } from "../../models/types/bfg-branded-ids"
// import { PlayerP2pActionStr } from "~/hooks/p2p/p2p-types"
import { useP2pGameRoomAsPlayer } from "~/hooks/p2p/game/use-bfg-game-room"
import { PlayerGameView } from "../components/player-game-view"
import { IPlayerBfgGameDetails } from "~/hooks/p2p/game/p2p-game-types";


// TODO: Delete this component; convert to hook (hopefully not context) somehow
// interface IPlayerP2pGameComponentProps {
//   // gameTableId: GameTableId
//   // myPlayerProfile: PrivatePlayerProfile
//   // mode: PlayerGameTabId
// }

export const PlayerP2pGameComponent = (props: IPlayerBfgGameDetails) => {
  // gameTableId,
  // myPlayerProfile,
  // mode
// }: IPlayerP2pGameComponentProps) => {

  // const p2pGame = usePlayerP2pGame(gameTableId, myPlayerProfile);
  // const p2pGame = useP2pGameRoomAsPlayer();

  // if (!p2pGame) {
  //   return <div>Loading P2P Game...</div>;
  // }

  // const {
  //   gameTable,
  //   gameActions,
  //   peerPlayers,
  //   // allPlayerProfiles,
  //   myPlayerSeat,
  //   txPlayerActionStr,
  //   myPrivatePlayerKnowledgeStr,
  // } = p2pGame;

  // const { connectionStatus, connectionEvents, peerIds, peerPlayerIds, allPlayerProfiles } = p2pGame.p2pDetails;
  const { gameTable, gameActions, gameMetadata, myPlayerProfile, myPlayerSeat, myPrivatePlayerKnowledgeStr, onPlayerAction, allPlayerProfiles } = props;

  if (!gameTable || !gameActions) {
    return (
      <div>
        Oops! Loading P2P Game...
      </div>
    )
    // return (
    //   <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
    //     <TabsContainerPanel<PlayerGameTabId>
    //       activeTabId={activeTabId}
    //       tabs={[
    //         {
    //           id: "player-game",
    //           icon: <span>👥</span>,
    //           content: (
    //             <div style={{ padding: '20px', textAlign: 'center' }}>
    //               <h3>Loading game content...</h3>
    //               <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
    //                 <div>Connection: {p2pGame.connectionStatus}</div>
    //                 <div>Peers connected: {p2pGame.peers.length}</div>
    //                 {p2pGame.peers.length === 0 && (
    //                   <div style={{ marginTop: '10px', color: '#d32f2f' }}>
    //                     ⚠️ No host detected. Make sure someone is running the game host at:<br/>
    //                     <code>/hosted-games/{gameTableId}</code>
    //                   </div>
    //                 )}
    //               </div>
    //             </div>
    //           )
    //         },
    //         // {
    //         //   id: "player-game-details",
    //         //   icon: <span>📊</span>,
    //         //   content: (
    //         //     <PlayerGameDetailsComponent />
    //         //   )
    //         // },
    //         // {
    //         //   id: "player-p2p-game-details",
    //         //   icon: <span>📡</span>,
    //         //   content: (
    //         //     <P2pConnectionComponent
    //         //       connectionStatus={p2pGame.connectionStatus}
    //         //       connectionEvents={p2pGame.connectionEvents}
    //         //       peers={p2pGame.peers}
    //         //       myPeerPlayer={playerProfile}
    //         //       peerPlayers={p2pGame.peerPlayers}
    //         //       allPlayerProfiles={allPlayerProfiles}
    //         //       onRefreshConnection={p2pGame.refreshConnection}
    //         //     />
    //         //   )
    //         // }
    //       ]}
    //       tabColor="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
    //     />
    //   </Container>
    // );
  }

  if (!myPlayerSeat) {
    return <div>You are not in a seat. Please join a seat to play.</div>;
  }

  // const { allPlayerProfiles } = props;

  // const onPlayerGameAction = (actionStr: PlayerP2pActionStr) => {
  //   txPlayerActionStr(actionStr);
  // }
  
  // const gameRegistry = useGameRegistry();
  // const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);

  // const myPrivatePlayerKnowledge = myPrivatePlayerKnowledgeStr ?
  //   gameMetadata.privatePlayerKnowledgeEncoder.decode(myPrivatePlayerKnowledgeStr as BfgEncodedString) :
  //   null;
  // const playerProfiles = new Map(otherPlayerProfiles);
  // const myPlayerPublicProfile = convertPrivateToPublicProfile(playerProfile);
  // playerProfiles.set(myPlayerPublicProfile.id, myPlayerPublicProfile);

  return (
    // <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
    //   <TabsContainerPanel
    //     activeTabId={mode}
    //     tabs={[
    //       {
    //         id: "player-game",
    //         icon: <span>🎮</span>,
    //         content: (
              <PlayerGameView
                myPlayerProfile={myPlayerProfile}
                myPlayerSeat={myPlayerSeat}
                gameTable={gameTable}
                gameMetadata={gameMetadata}
                // peers={peerIds}
                // peerPlayerIds={peerPlayerIds}
                allPlayerProfiles={allPlayerProfiles}
                gameActions={gameActions}
                // myPrivatePlayerKnowledge={myPrivatePlayerKnowledge}
                myPrivatePlayerKnowledgeStr={myPrivatePlayerKnowledgeStr}
                onPlayerAction={onPlayerAction}
              />
    //         )
    //       },
    //       {
    //         id: "player-game-details",
    //         icon: <span>📊</span>,
    //         content: (
    //           <PlayerGameDetailsComponent
    //           />
    //         )
    //       },
    //       {
    //         id: "player-p2p-game-details",
    //         icon: <span>📡</span>,
    //         content: (
    //           <P2pConnectionComponent
    //             connectionStatus={p2pGame.connectionStatus}
    //             connectionEvents={p2pGame.connectionEvents}
    //             peers={p2pGame.peers}
    //             myPeerPlayer={playerProfile}
    //             peerPlayers={p2pGame.peerPlayers}
    //             allPlayerProfiles={allPlayerProfiles}
    //             onRefreshConnection={p2pGame.refreshConnection}
    //           />
    //         )
    //       }
    //     ]}
    //     tabColor="linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
    //   />
    // </Container>
  )
}
