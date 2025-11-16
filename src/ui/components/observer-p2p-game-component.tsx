import { Container, Box, Typography, Select, Option } from "../bfg-ui"
import { ContentLoading } from "../bfg-ui/components/ContentLoading/ContentLoading"
import { useState } from "react"
import { GameTableSeat } from "../../models/game-table/game-room-p2p"
// import { BfgEncodedString } from "@bfg-engine/game-metadata/encoders"
// import type { IBfgJsonZodObjectDataEncoder } from "@bfg-engine/game-metadata/encoders"
import { IPublicBfgGameDetails } from "@bfg-engine/hooks/p2p/game/p2p-game-types"


// // TODO: Delete this component; convert to context somehow... see HostObserverP2pGameComponent
// interface IObserverP2pGameComponentProps {
//   gameTableId: BfgGameTableId
// }

export const ObserverP2pGameComponent = (props: IPublicBfgGameDetails) => {

  // const p2pGame = useP2pGameRoomAsObserver();
  const { gameRoom, latestWatcherGameEvent, watcherGameEvents, gameMetadata, allPlayerProfiles } = props;
  const [viewPerspective, setViewPerspective] = useState<GameTableSeat | null>(null);

  // if (!p2pGame) {
  //   return (
  //     <ContentLoading
  //       message="Loading P2P Game..."
  //     />
  //   )
  // }

  // const p2p = p2pGame.p2p;

  // if (!p2p) {
  //   return (
  //     <ContentLoading
  //       message="Loading P2P Observer Data..."
  //     />
  //   )
  // }

  // const { gameTable, gameActions } = p2p;

  if (!gameRoom || !watcherGameEvents || !gameMetadata) {
    return (
      <ContentLoading
        message="Loading Game xDetails..."
      />
    )
  }

  // if (gameTable.id !== BfgGameTableId) {
  //   throw new Error('Game Table ID does not match: ' + gameTable.id + ' !== ' + BfgGameTableId);
  // }

  // const gameRegistry = useGameRegistry();
  // const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);

  const latestAction = latestWatcherGameEvent;
  
  // const latestAction = gameActions[gameActions.length - 1];
  if (!latestAction) {
    return (
      <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
        <Typography variant="body1">No game actions yet...</Typography>
      </Container>
    );
  }

  // const gameSpecificStateEncoder = gameMetadata.encoders.publicGameStateEncoder;
  // if (gameSpecificStateEncoder.format !== 'json-zod-object-string') {
  //   throw new Error('Game specific state encoder format is not json-zod-object-string');
  // }

  // const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  // const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  // const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  // const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  const gameSpecificState = latestAction.nextGameWatcherState;

  if (!gameSpecificState) {
    return (
      <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
        <Typography variant="h6">Loading Game State...</Typography>
        <Typography variant="body2" color="secondary">
          Waiting for game state from host...
        </Typography>
      </Container>
    )
  }

  const gameRepresentation = gameMetadata.components.ObserverComponent({
    gameState: gameSpecificState,
    gameRoom,
    allPlayerProfiles,
    latestWatcherGameEvent,
    watcherGameEvents,
    hostPlayerProfileId: gameRoom.gameHostPlayerProfileId,
    observedPlayerProfileId: null,
    observedPlayerSeat: viewPerspective,
  });

  
  return (
    <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
      {/* <TabsContainerPanel
        activeTabId={mode}
        tabs={[
          {
            id: "player-game",
            icon: <span>👁️</span>,
            content: ( */}
              <Box>
                {/* <Typography variant="h5" style={{ marginBottom: '16px', color: '#666' }}>
                  🔍 Observer View (Read-Only)
                </Typography> */}
                
                <Box style={{ marginBottom: '24px' }}>
                  <Select
                    label="View Perspective"
                    value={viewPerspective || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setViewPerspective(value === '' ? null : value as GameTableSeat);
                    }}
                    fullWidth
                  >
                    <Option value="">No Player (Observer)</Option>
                    {gameRoom.players.map((player) => {
                      return (
                        <Option key={player.playerProfileId} value={player.playerProfileId}>
                          {player.playerProfileId.substring(0, 16)}...
                          {player.playerName}
                        </Option>
                      );
                    })}
                    {/* {ALL_PLAYER_SEATS.map((seat) => {
                      const playerId = gameRoom.gameTable[seat];
                      if (!playerId) return null;
                      return (
                        <Option key={seat} value={seat}>
                          {seat.toUpperCase()} - {playerId.substring(0, 16)}...
                        </Option>
                      );
                    })} */}
                  </Select>
                </Box>
                
                {gameRepresentation}
              </Box>
            {/* )
          },
          // {
          //   id: "player-game-details",
          //   icon: <span>📊</span>,
          //   content: (
          //     <div style={{ padding: '20px' }}>
          //       <h2>Game Details</h2>
          //       <div style={{ marginBottom: '16px' }}>
          //         <strong>Game Table ID:</strong> {gameTableId}
          //       </div>
          //       <div style={{ marginBottom: '16px' }}>
          //         <strong>Game State:</strong>
          //         <pre style={{ 
          //           backgroundColor: '#f5f5f5', 
          //           padding: '12px', 
          //           borderRadius: '4px',
          //           overflow: 'auto',
          //           maxHeight: '400px'
          //         }}>
          //           {JSON.stringify(gameTable, null, 2)}
          //         </pre>
          //       </div>
          //       <div>
          //         <strong>Game Actions ({gameActions.length}):</strong>
          //         <pre style={{ 
          //           backgroundColor: '#f5f5f5', 
          //           padding: '12px', 
          //           borderRadius: '4px',
          //           overflow: 'auto',
          //           maxHeight: '400px'
          //         }}>
          //           {JSON.stringify(gameActions, null, 2)}
          //         </pre>
          //       </div>
          //     </div>
          //   )
          // },
          // {
          //   id: "player-p2p-game-details",
          //   icon: <span>📡</span>,
          //   content: (
          //     <P2pConnectionComponent
          //       connectionStatus={p2pGame.connectionStatus}
          //       connectionEvents={p2pGame.connectionEvents}
          //       peers={p2pGame.peers}
          //       peerPlayers={p2pGame.peerPlayers}
          //       allPlayerProfiles={p2pGame.allPlayerProfiles}
          //       onRefreshConnection={p2pGame.refreshConnection}
          //     />
          //   )
          // }
        ]}
        tabColor="linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)"
      /> */}
    </Container>
  )
}
