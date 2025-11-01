import { AppBarTabItem } from "../bfg-app-bar/tab-item-hook"
import { NavSpine } from "../bfg-app-bar/nav-spine"
import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar"


const tabItems: AppBarTabItem[] = [
  {
    id: "new-lobby",
    label: "Create Lobby",
  }
]

export const NewLobbyAppBar = () => {

  return (
    <BruteForceGamesAppBar >
      {({ isNarrowScreen }) => (
        <NavSpine
          title="Brute Force Games Starter"
          isNarrowScreen={isNarrowScreen}
          tabsConfig={{
            tabItems,
            activeTabId: "new-lobby",
            onTabChange: () => {}
          }}
        />
      )}
    </BruteForceGamesAppBar>
  )
}
