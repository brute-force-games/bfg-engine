import { z } from "zod"
import { Container, Box, Typography, Select, Option } from "../bfg-ui"
import { useGameRegistry } from "../../hooks/games-registry/games-registry"
import { ContentLoading } from "../bfg-ui/components/ContentLoading/ContentLoading"
import { useState } from "react"
import { GameTable, GameTableSeat, PLAYER_SEATS } from "../../models/game-table/game-table"
import { DbGameTableAction } from "../../models/game-table/game-table-action"
import { IBfgJsonZodObjectDataEncoder, BfgEncodedString } from "~/models/game-engine/encoders"
import { ObserverComponentProps } from "~/models/game-engine/bfg-game-engine-types"


interface IHostObserverP2pGameComponentProps {
  hostedGame: GameTable
  gameActions: DbGameTableAction[]
}

export const HostObserverP2pGameComponent = ({ hostedGame, gameActions }: IHostObserverP2pGameComponentProps) => {

  // const p2pGame = useObserverP2pGame(gameTableId);
  const [viewPerspective, setViewPerspective] = useState<GameTableSeat | null>(null);

  // if (!p2pGame) {
  //   return (
  //     <ContentLoading
  //       message="Loading P2P Game Observer View..."
  //     />
  //   )
  // }

  // const { gameTable, gameActions } = p2pGame;

  if (!hostedGame || !gameActions) {
    return (
      <ContentLoading
        message="Loading Game xDetails..."
      />
    )
  }

  // Render the game using the game engine's renderer
  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(hostedGame.gameTitle);
  
  // const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
  //   z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
  //   z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
  // >;
  
  const latestAction = gameActions[gameActions.length - 1];
  if (!latestAction) {
    return (
      <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
        <Typography variant="body1">No game actions yet...</Typography>
      </Container>
    );
  }
  
  // const gameSpecificState = gameEngine.parseGameSpecificGameStateJson(
  //   latestAction.actionOutcomeGameStateJson as any);
  
  // const latestGameSpecificAction = gameEngine.parseGameSpecificActionJson(
  //   latestAction.actionJson as any);


  // const gameRepresentationProps: GameStateRepresentationProps<typeof gameSpecificState, typeof latestGameSpecificAction> = {
  //   hostPlayerProfileId: hostedGame.gameHostPlayerProfileId,
  //   myPlayerProfileId: null,
  //   myPlayerSeat: viewPerspective,
  //   viewLevel: 'observer-level',
  //   gameState: gameSpecificState,
  //   mostRecentAction: latestGameSpecificAction,
  // };
  // const gameRepresentation = gameEngine.rendererFactory
  //   .createGameStateRepresentationComponent(gameRepresentationProps);

  
  const gameSpecificStateEncoder = gameMetadata.gameSpecificStateEncoder;
  if (gameSpecificStateEncoder.format !== 'json-zod-object') {
    throw new Error('Game specific state encoder format is not json-zod-object');
  }

  const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  // const hostActionEncoder = gameMetadata.hostActionEncoder;
  // if (hostActionEncoder.format !== 'json-zod-object') {
  //   throw new Error('Host action encoder format is not json-zod-object');
  // }

  // const zodHostActionEncoder = hostActionEncoder as IBfgJsonZodObjectDataEncoder<any>;
  // const zodHostActionSchema = zodHostActionEncoder.schema as z.ZodTypeAny;

  const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  const observerComponentProps: ObserverComponentProps<z.infer<typeof zodGameSpecificStateSchema>> = {
    gameState: gameSpecificState,
    hostPlayerProfileId: hostedGame.gameHostPlayerProfileId,
    observedPlayerProfileId: null,
    observedPlayerSeat: viewPerspective,
  };
  const observerRepresentation = gameMetadata.components.ObserverComponent(observerComponentProps);

  return (
    // <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
    //   <TabsContainerPanel
    //     activeTabId={activeTabId}
    //     tabs={[
    //       {
    //         id: "player-game",
    //         icon: <span>👁️</span>,
    //         content: (
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
                    {PLAYER_SEATS.map((seat) => {
                      const playerId = hostedGame[seat];
                      if (!playerId) return null;
                      return (
                        <Option key={seat} value={seat}>
                          {seat.toUpperCase()} - {playerId.substring(0, 16)}...
                        </Option>
                      );
                    })}
                  </Select>
                </Box>
                
                {observerRepresentation}
              </Box>
            // )
    //       },
    //       {
    //         id: "player-game-details",
    //         icon: <span>📊</span>,
    //         content: (
    //           <div style={{ padding: '20px' }}>
    //             <h2>Game Details</h2>
    //             <div style={{ marginBottom: '16px' }}>
    //               <strong>Game Table ID:</strong> {gameTableId}
    //             </div>
    //             <div style={{ marginBottom: '16px' }}>
    //               <strong>Game State:</strong>
    //               <pre style={{ 
    //                 backgroundColor: '#f5f5f5', 
    //                 padding: '12px', 
    //                 borderRadius: '4px',
    //                 overflow: 'auto',
    //                 maxHeight: '400px'
    //               }}>
    //                 {JSON.stringify(gameTable, null, 2)}
    //               </pre>
    //             </div>
    //             <div>
    //               <strong>Game Actions ({gameActions.length}):</strong>
    //               <pre style={{ 
    //                 backgroundColor: '#f5f5f5', 
    //                 padding: '12px', 
    //                 borderRadius: '4px',
    //                 overflow: 'auto',
    //                 maxHeight: '400px'
    //               }}>
    //                 {JSON.stringify(gameActions, null, 2)}
    //               </pre>
    //             </div>
    //           </div>
    //         )
    //       },
    //       {
    //         id: "player-p2p-game-details",
    //         icon: <span>📡</span>,
    //         content: (
    //           <P2pConnectionComponent
    //             connectionStatus={p2pGame.connectionStatus}
    //             connectionEvents={p2pGame.connectionEvents}
    //             peerProfiles={p2pGame.peerProfiles}
    //             playerProfiles={p2pGame.playerProfiles}
    //             onRefreshConnection={p2pGame.refreshConnection}
    //           />
    //         )
    //       }
    //     ]}
    //     tabColor="linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)"
    //   />
    // </Container>
  )
}
