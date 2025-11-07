import { PublicPlayerProfile, PlayerProfileId, Stack, BfgGameSpine } from "@bfg-engine";
import { useAppSettings } from "~/hooks/stores/use-my-app-settings-store";
import { useUserGameSettings } from "~/hooks/stores/use-user-game-settings-store";
import { useUserGameTableSettings } from "~/hooks/stores/use-user-game-table-settings-store";
import { BfgStarterNavBar } from "../bfg-nav-bar/bfg-starter-nav-bar";
import { BfgGameSpineNavBar } from "../bfg-nav-bar/bfg-game-spine-nav-bar";
import { BfgGameEngineMetadata } from "~/models/bfg-game-engines";
import { BfgPublicGameImplState } from "~/models/game-engine/bfg-game-engine-types";
import { GameTable } from "~/models/game-table/game-table";
import { GameLogPanel } from "../game-log-panel";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { AppBarTabsConfig } from "../bfg-app-bar/tabs-config";
import { createGameContext } from "~/hooks/p2p/game/use-optional-game-context";

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

interface BfgGameScreenFrameProps<TTabId extends string = string> {
  tabsConfig: AppBarTabsConfig<TTabId> | null;
  gameMetadata: BfgGameEngineMetadata;
  gameTable: GameTable;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  gameState: BfgPublicGameImplState;
  gameActions: DbGameTableAction[];

  children: React.ReactNode;
}

export const BfgGameScreenFrame = <TTabId extends string = string>(props: BfgGameScreenFrameProps<TTabId>) => {

  const { tabsConfig, gameMetadata, gameTable, allPlayerProfiles, gameState, gameActions, children } = props;

  // Get settings from all three levels for proper inheritance
  const appSettings = useAppSettings();
  const gameSettings = useUserGameSettings(gameTable.gameTitle);
  const tableSettings = useUserGameTableSettings(gameTable.id);

  // Apply inheritance chain: Table > Game > App
  const gameSpineLocation = tableSettings.gameSpineLocation ?? gameSettings.gameSpineLocation ?? appSettings.gameSpineLocation;
  const gameLogPanelLocation = tableSettings.gameLogPanelLocation ?? gameSettings.gameLogPanelLocation ?? appSettings.gameLogPanelLocation;

  // Create game context for the app bar
  const gameContext = createGameContext(
    gameTable.gameTitle, 
    gameTable.id,
    gameTable.tableName
  );

  const { GameSpineComponent } = gameMetadata.components;

  const nextToActPlayers = gameMetadata.engine.getNextToActPlayers(gameTable, gameState);
  const playerDetailsLineFn = gameMetadata.engine.getPlayerDetailsLine;

  const gameSpineOrientation = gameSpineLocation === 'left' || gameSpineLocation === 'right' ? 
    'vertical' :
    'horizontal';

  const bfgGameSpine = GameSpineComponent ?
    <GameSpineComponent
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      gameState={gameState}
      orientation={gameSpineOrientation}
    /> :
    <BfgGameSpine
      gameTitle={gameMetadata.gameTitle}
      orientation={gameSpineOrientation}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      nextToActPlayers={nextToActPlayers}
      gameState={gameState}
      playerDetailsLineFn={playerDetailsLineFn}
    />;
    
  const bfgGameLogPanel = (
    <GameLogPanel
      gameActions={gameActions}
    />
  );

  const bfgAppBar = gameSpineLocation === 'nav-bar' ?
    <BfgGameSpineNavBar
      gameMetadata={gameMetadata}
      gameTable={gameTable}
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
