import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar";
import { AppBarTabItem } from "../bfg-app-bar/tab-item-hook";
import { NavSpine } from "../bfg-app-bar/nav-spine";


interface BfgStarterNavBarProps<TTabId extends string = string> {
  tabsConfig: {
    tabItems: readonly AppBarTabItem<TTabId>[];
    activeTabId: TTabId;
    onTabChange: (tabId: TTabId) => void;
  } | null;
  // activeTabId: GameTabId;
  // myGameTableAccess: GameTableAccessRole;
  // gameTabItems: readonly AppBarTabItem<GameTabId>[];
  // activeTabId: TTabId;  
}

export const BfgStarterNavBar = (props: BfgStarterNavBarProps) => {
  // const { myGameTableAccess, activeTabId } = props;
  const { tabsConfig } = props;

  // const gameTabItems = getGameTabItems(myGameTableAccess);
  // const tabsConfig = {
  //   tabItems: gameTabItems,
  //   activeTabId: activeTabId,
  // };

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
