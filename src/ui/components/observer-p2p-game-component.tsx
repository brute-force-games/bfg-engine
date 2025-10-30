import { z } from "zod"
import { GameTableId } from "../../models/types/bfg-branded-ids"
import { Container, Box, Typography, Select, Option } from "../bfg-ui"
import { PlayerGameTabId } from "./bfg-tabs"
import { useObserverP2pGame } from "../../hooks/p2p/game/use-observer-p2p-game"
import { useGameRegistry } from "../../hooks/games-registry/games-registry"
import { ContentLoading } from "../bfg-ui/components/ContentLoading/ContentLoading"
import { useState } from "react"
import { GameTableSeat, PLAYER_SEATS } from "../../models/game-table/game-table"
import { BfgEncodedString, IBfgJsonZodObjectDataEncoder } from "~/models/game-engine/encoders"


// TODO: Delete this component; convert to context somehow... see HostObserverP2pGameComponent
interface IObserverP2pGameComponentProps {
  gameTableId: GameTableId
  mode: PlayerGameTabId
}

export const ObserverP2pGameComponent = ({ gameTableId, mode }: IObserverP2pGameComponentProps) => {

  const p2pGame = useObserverP2pGame(gameTableId);
  const [viewPerspective, setViewPerspective] = useState<GameTableSeat | null>(null);

  if (!p2pGame) {
    return (
      <ContentLoading
        message="Loading P2P Game Observer View..."
      />
    )
  }

  const { gameTable, gameActions } = p2pGame;

  if (!gameTable || !gameActions) {
    return (
      <ContentLoading
        message="Loading Game xDetails..."
      />
    )
  }

  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  
  const latestAction = gameActions[gameActions.length - 1];
  if (!latestAction) {
    return (
      <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
        <Typography variant="body1">No game actions yet...</Typography>
      </Container>
    );
  }

  const gameSpecificStateEncoder = gameMetadata.gameSpecificStateEncoder;
  if (gameSpecificStateEncoder.format !== 'json-zod-object') {
    throw new Error('Game specific state encoder format is not json-zod-object');
  }

  const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  const gameRepresentation = gameMetadata.components.ObserverComponent({
    gameState: gameSpecificState,
    gameTable: gameTable,
    allPlayerProfiles: p2pGame.allPlayerProfiles,
    latestGameAction: latestAction,
    hostPlayerProfileId: gameTable.gameHostPlayerProfileId,
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
                    {PLAYER_SEATS.map((seat) => {
                      const playerId = gameTable[seat];
                      if (!playerId) return null;
                      return (
                        <Option key={seat} value={seat}>
                          {seat.toUpperCase()} - {playerId.substring(0, 16)}...
                        </Option>
                      );
                    })}
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
