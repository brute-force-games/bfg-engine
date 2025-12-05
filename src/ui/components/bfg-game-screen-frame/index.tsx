import { PublicPlayerProfile, PlayerProfileId, Stack, BfgGameSpine, Container, Typography } from "@bfg-engine";
import { useAppSettings } from "@bfg-engine/hooks/stores/use-my-app-settings-store";
import { useUserGameSettings } from "@bfg-engine/hooks/stores/use-user-game-settings-store";
import { useUserGameTableSettings } from "@bfg-engine/hooks/stores/use-user-game-table-settings-store";
import { BfgStarterNavBar } from "../bfg-nav-bar/bfg-starter-nav-bar";
import { BfgGameSpineNavBar } from "../bfg-nav-bar/bfg-game-spine-nav-bar";
import { BfgGameEngineMetadata } from "@bfg-engine/game-metadata/metadata-types";
import { type GameRoomP2p } from "@bfg-engine/models/p2p/game-room-p2p";
import { GameLogPanel } from "../game-log-panel";
import { AppBarTabsConfig } from "../bfg-app-bar/tabs-config";
import { OptionalGameContext } from "@bfg-engine/hooks/p2p/game/use-optional-game-context";
import type { z } from "zod";


// Fixed width for side panels (log panel and game spine)
const SIDE_PANEL_WIDTH = 150;

interface FixedWidthPanelProps {
  children: React.ReactNode;
}

const FixedWidthPanel = ({ children }: FixedWidthPanelProps) => {
  return (
    <div style={{ 
      width: `${SIDE_PANEL_WIDTH}px`, 
      minWidth: `${SIDE_PANEL_WIDTH}px`, 
      maxWidth: `${SIDE_PANEL_WIDTH}px`, 
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {children}
    </div>
  );
};

// type SCHEMAS = 'schemas';

interface BfgGameScreenFrameProps<
  TTabId extends string = string,
  TGameMetadata extends BfgGameEngineMetadata = BfgGameEngineMetadata
> {
  tabsConfig: AppBarTabsConfig<TTabId> | null;
  gameMetadata: TGameMetadata;
  gameRoom: GameRoomP2p;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  gameState: z.infer<TGameMetadata['schemas']['watcherGameStatePerspectiveSchema']> | null;
  // boardEvents: GameTableEventWithTransitionForWatcherP2p[];
  boardEvents: z.infer<TGameMetadata['schemas']['gameTableEventSchema']>[];

  children: React.ReactNode;
}

export const BfgGameScreenFrame = <
  TTabId extends string = string,
  TGameMetadata extends BfgGameEngineMetadata = BfgGameEngineMetadata
>(props: BfgGameScreenFrameProps<TTabId, TGameMetadata>) => {

  const { tabsConfig, gameMetadata, gameRoom, allPlayerProfiles, gameState, boardEvents, children } = props;

  // Defensive check for null gameTable
  if (!gameRoom || !gameState) {
    // console.error('BfgGameScreenFrame received null gameTable:', props);
    // return (
    //   <div style={{ padding: '20px', color: 'red', fontWeight: 'bold' }}>
    //     Error: Game table is null or undefined. Props: {JSON.stringify(props, null, 2)}
    //   </div>
    // );
    return (
      <Container style={{ padding: '24px' }}> <Stack spacing={3}>
        <Typography variant="h3">Loading Game Screen Frame...</Typography>
        <Typography variant="body1" color="secondary">
          { !gameRoom && <Typography variant="body1" color="secondary">Waiting for game table...</Typography> }
          { !gameState && <Typography variant="body1" color="secondary">Waiting for game state...</Typography> }
        </Typography>
      </Stack> </Container>
    )
  }

  // // Defensive check for null gameState
  // if (!gameState) {
  //   console.error('BfgGameScreenFrame received null gameState:', props);
  //   return (
  //     <div style={{ padding: '20px', color: 'orange', fontWeight: 'bold' }}>
  //       Loading game state...
  //     </div>
  //   );
  // }

  // Get settings from all three levels for proper inheritance
  const appSettings = useAppSettings();
  const gameSettings = useUserGameSettings(gameRoom.gameTitle);
  const tableSettings = useUserGameTableSettings(gameRoom.id);

  // Apply inheritance chain: Table > Game > App
  const gameSpineLocation = tableSettings.gameSpineLocation ?? gameSettings.gameSpineLocation ?? appSettings.gameSpineLocation;
  const gameLogPanelLocation = tableSettings.gameLogPanelLocation ?? gameSettings.gameLogPanelLocation ?? appSettings.gameLogPanelLocation;

  // Create game context for the app bar
  const gameContext: OptionalGameContext = {
    gameTitle: gameRoom.gameTitle,
    gameTableId: gameRoom.id,
    tableName: gameRoom.tableName
  };

  const { GameSpineComponent } = gameMetadata.components;

  const nextToActPlayers = gameMetadata.gameProcessor.getNextToActPlayers(gameRoom, gameState);
  const playerDetailsLineFn = gameMetadata.gameProcessor.getPlayerDetailsLine;

  const gameSpineOrientation = gameSpineLocation === 'left' || gameSpineLocation === 'right' ? 
    'vertical' :
    'horizontal';

  const bfgGameSpine = GameSpineComponent ?
    <GameSpineComponent
      gameRoom={gameRoom}
      allPlayerProfiles={allPlayerProfiles}
      gameState={gameState}
      orientation={gameSpineOrientation}
    /> :
    <BfgGameSpine
      gameTitle={gameMetadata.gameTitle}
      orientation={gameSpineOrientation}
      gameRoom={gameRoom}
      allPlayerProfiles={allPlayerProfiles}
      nextToActPlayers={nextToActPlayers}
      gameState={gameState}
      playerDetailsLineFn={playerDetailsLineFn}
    />;
    
  const bfgGameLogPanel = (
    <GameLogPanel<TGameMetadata['schemas']['watcherGameEventPerspectiveSchema']>
      boardEvents={boardEvents}
    />
  );

  const bfgAppBar = gameSpineLocation === 'nav-bar' ?
    <BfgGameSpineNavBar
      gameMetadata={gameMetadata}
      gameRoom={gameRoom}
      allPlayerProfiles={allPlayerProfiles}
      gameState={gameState}
      gameContext={gameContext}
    /> : 
    <BfgStarterNavBar
      tabsConfig={tabsConfig}
      gameContext={gameContext}
    />;


  const BfgGameBoardFrame = () => {
    return (
      <Stack direction="row" style={{ flex: 1, minHeight: 0 }}>
        {gameLogPanelLocation === 'left' && (
          <FixedWidthPanel>
            {bfgGameLogPanel}
          </FixedWidthPanel>
        )}
        {gameSpineLocation === 'left' && (
          <FixedWidthPanel>
            {bfgGameSpine}
          </FixedWidthPanel>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
        {gameSpineLocation === 'right' && (
          <FixedWidthPanel>
            {bfgGameSpine}
          </FixedWidthPanel>
        )}
        {gameLogPanelLocation === 'right' && (
          <FixedWidthPanel>
            {bfgGameLogPanel}
          </FixedWidthPanel>
        )}
      </Stack>
    );
  };

  return (
    <Stack direction="column" style={{ height: '100vh' }}>
      {bfgAppBar}
      {gameSpineLocation === 'top' && bfgGameSpine}
      <BfgGameBoardFrame />
      {gameSpineLocation === 'bottom' && bfgGameSpine}
    </Stack>
  );
};
