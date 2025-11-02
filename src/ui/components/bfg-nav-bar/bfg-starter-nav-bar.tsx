import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar";
import { AppBarTabItem } from "../bfg-app-bar/tab-item-hook";
import { NavSpine } from "../bfg-app-bar/nav-spine";


interface BfgStarterNavBarProps<TTabId extends string = string> {
  tabsConfig: {
    tabItems: readonly AppBarTabItem<TTabId>[];
    activeTabId: TTabId;
    onTabChange: (tabId: TTabId) => void;
  } | null;
}

export const BfgStarterNavBar = <TTabId extends string = string>(props: BfgStarterNavBarProps<TTabId>) => {
  const { tabsConfig } = props;

  if (!tabsConfig) {
    return (
      <BruteForceGamesAppBar />
    )
  }

  return (
    <BruteForceGamesAppBar>
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
