import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar";
import { AppBarTabItem } from "../bfg-app-bar/tab-item-hook";
import { NavSpine } from "../bfg-app-bar/nav-spine";
import { OptionalGameContext } from "@bfg-engine/hooks/p2p/game/use-optional-game-context";


interface BfgStarterNavBarProps<TTabId extends string = string> {
  tabsConfig: {
    tabItems: readonly AppBarTabItem<TTabId>[];
    activeTabId: TTabId;
    onTabClicked: (tabId: TTabId) => void;
  } | null;
  gameContext?: OptionalGameContext;
}

export const BfgStarterNavBar = <TTabId extends string = string>(props: BfgStarterNavBarProps<TTabId>) => {
  const { tabsConfig, gameContext } = props;

  if (!tabsConfig) {
    return (
      <BruteForceGamesAppBar gameContext={gameContext} />
    )
  }

  return (
    <BruteForceGamesAppBar gameContext={gameContext}>
      {({ isNarrowScreen }) => (
        <NavSpine
          title="Brute Force Games Starter"
          isNarrowScreen={isNarrowScreen}
          tabsConfig={tabsConfig}
        />
      )}
    </BruteForceGamesAppBar>
  )
}
