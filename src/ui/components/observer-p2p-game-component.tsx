import { z } from "zod"
import { GameTableId } from "../../models/types/bfg-branded-ids"
import { Container, TabsContainerPanel, Box, Typography, Select, Option } from "../bfg-ui"
import { P2pConnectionComponent } from "./p2p-connection-component"
import { PlayerGameTabId } from "./bfg-tabs"
import { useObserverP2pGame } from "../../hooks/p2p/use-observer-p2p-game"
import { useGameRegistry } from "../../hooks/games-registry/games-registry"
import { BfgGameEngineProcessor } from "../../models/game-engine/bfg-game-engines"
import { ContentLoading } from "../bfg-ui/components/ContentLoading/ContentLoading"
import { useState } from "react"
import { GameTableSeat, PLAYER_SEATS } from "../../models/game-table/game-table"


interface IObserverP2pGameComponentProps {
  gameTableId: GameTableId
  activeTabId: PlayerGameTabId
}

export const ObserverP2pGameComponent = ({ gameTableId, activeTabId }: IObserverP2pGameComponentProps) => {

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

  // Render the game using the game engine's renderer
  const gameRegistry = useGameRegistry();
  const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  
  const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
    z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
    z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
  >;
  
  const latestAction = gameActions[gameActions.length - 1];
  if (!latestAction) {
    return (
      <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
        <Typography variant="body1">No game actions yet...</Typography>
      </Container>
    );
  }
  
  const gameSpecificState = gameEngine.parseGameSpecificGameStateJson(
    latestAction.actionOutcomeGameStateJson as any);
  
  const latestGameSpecificAction = gameEngine.parseGameSpecificActionJson(
    latestAction.actionJson as any);
    
  const gameRepresentation = gameEngine.rendererFactory
    .createGameStateRepresentationComponent(
      viewPerspective, 
      gameSpecificState, 
      latestGameSpecificAction, 
    );

  return (
    <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
      <TabsContainerPanel
        activeTabId={activeTabId}
        tabs={[
          {
            id: "player-game",
            icon: <span>👁️</span>,
            content: (
              <Box>
                <Typography variant="h5" style={{ marginBottom: '16px', color: '#666' }}>
                  🔍 Observer View (Read-Only)
                </Typography>
                
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
            )
          },
          {
            id: "player-game-details",
            icon: <span>📊</span>,
            content: (
              <div style={{ padding: '20px' }}>
                <h2>Game Details</h2>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Game Table ID:</strong> {gameTableId}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Game State:</strong>
                  <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '12px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '400px'
                  }}>
                    {JSON.stringify(gameTable, null, 2)}
                  </pre>
                </div>
                <div>
                  <strong>Game Actions ({gameActions.length}):</strong>
                  <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '12px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '400px'
                  }}>
                    {JSON.stringify(gameActions, null, 2)}
                  </pre>
                </div>
              </div>
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
        tabColor="linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)"
      />
    </Container>
  )
}
