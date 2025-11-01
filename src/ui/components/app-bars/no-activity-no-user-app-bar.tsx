import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar"
import { NavSpine } from "../bfg-app-bar/nav-spine"
import { AppBarTabItem } from "../bfg-app-bar/tab-item-hook"


export const NoActivityNoUserAppBar = () => {

  
  // return (
  //   <BruteForceGamesAppBar
  //     tabsConfig={{
  //       tabItems: [
  //       {
  //         id: "home", 
  //         label: "Home",
  //         link: { to: "/" },
  //       },
  //       {
  //         id: "new-lobby",
  //         label: "Create Lobby",
  //         link: { to: "/new-lobby" },
  //       },
  //     ],
  //       activeTabId: "home",
  //       onTabChange: () => {},
  //     }}
  //   />
  // )

  const tabItems: AppBarTabItem[] = [
    {
      id: "home", 
      label: "Home"
    }
  ]

  return (
    <BruteForceGamesAppBar
      // tabsConfig={{
      //   tabItems: [
      //   {
      //     id: "home", 
      //     label: "Home",
      //     link: { to: "/" },
      //   },
      //   {
      //     id: "new-lobby",
      //     label: "Create Lobby",
      //     link: { to: "/new-lobby" },
      //   },
      // ],
      //   activeTabId: "home",
      //   onTabChange: () => {},
      // }}
    >
      {({ isNarrowScreen }) => (
        <NavSpine
          title="Brute Force Games Starter"
          isNarrowScreen={isNarrowScreen}
          tabsConfig={{
            tabItems,
            activeTabId: "home",
            onTabChange: () => {}
          }}
        />
      )}
    </BruteForceGamesAppBar>
  )
}
