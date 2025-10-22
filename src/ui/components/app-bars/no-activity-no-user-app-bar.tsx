import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar"


export const NoActivityNoUserAppBar = () => {

  return (
    <BruteForceGamesAppBar
      tabsConfig={{
        tabItems: [
        {
          id: "home", 
          label: "Home",
          link: { to: "/" },
        },
        {
          id: "new-lobby",
          label: "Create Lobby",
          link: { to: "/new-lobby" },
        },
        // {
        //   id: "my-player-profiles",
        //   label: "My Player Profiles",
        //   link: { to: "/my-player-profiles",            
        // },
      ],
        activeTabId: "home",
        onTabChange: () => {},
      }}
    />
  )
}
