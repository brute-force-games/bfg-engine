import { PublicPlayerProfile, PlayerProfileId, Stack, BfgGameSpine } from "@bfg-engine";
import { useAppSettings } from "~/hooks/stores/use-my-app-settings-store";
import { BfgStarterNavBar } from "../bfg-nav-bar/bfg-starter-nav-bar";
import { BfgGameSpineNavBar } from "../bfg-nav-bar/bfg-game-spine-nav-bar";
import { AppBarTabItem } from "../bfg-app-bar/tab-item-hook";
import { BfgGameEngineMetadata } from "~/models/bfg-game-engines";
import { BfgGameImplHostAction, BfgGameImplPlayerAction, BfgPublicGameImplState } from "~/models/game-engine/bfg-game-engine-types";
import { GameTable } from "~/models/game-table/game-table";
import { GameLogPanel } from "../game-log-panel";
import { DbGameTableAction } from "~/models/game-table/game-table-action";

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
  tabsConfig: {
    tabItems: readonly AppBarTabItem<TTabId>[];
    activeTabId: TTabId;
    onTabChange: (tabId: TTabId) => void;
  } | null;
  gameMetadata: BfgGameEngineMetadata<BfgPublicGameImplState, BfgGameImplPlayerAction, BfgGameImplHostAction>;
  gameTable: GameTable;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  gameState: BfgPublicGameImplState;
  gameActions: DbGameTableAction[];

  children: React.ReactNode;
}

export const BfgGameScreenFrame = <TTabId extends string = string>(props: BfgGameScreenFrameProps<TTabId>) => {

  const { tabsConfig, gameMetadata, gameTable, allPlayerProfiles, gameState, gameActions, children } = props;

  const appSettings = useAppSettings();
  const { gameSpineLocation, gameLogPanelLocation } = appSettings;

  // const bfgGameSpine = gameMetadata.components.GameSpineComponent?.({
  //   gameTable,
  //   allPlayerProfiles,
  //   gameState,
  // });

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
      // gameSourceUrl={gameMetadata.gameSourceUrl}
      orientation={gameSpineOrientation}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      nextToActPlayers={nextToActPlayers}
      gameState={gameState}
      playerDetailsLineFn={playerDetailsLineFn}
    />;
    
  // const bfgGameLogPanel = <div>Game Log Panel</div>;  
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
    /> : 
    <BfgStarterNavBar
      tabsConfig={tabsConfig}
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
