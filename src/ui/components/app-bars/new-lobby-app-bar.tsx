import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar"


export const NewLobbyAppBar = () => {
  // const NewLobbyTabItems: readonly AppBarTabItem<NewLobbyTabId>[] = [
  //   { id: 'new-lobby', label: 'New Lobby', link: { to: '/new-lobby' } },
  // ];

  return (
    <BruteForceGamesAppBar 
      tabsConfig={null}
      // tabsConfig={{
      //   tabItems: NewLobbyTabItems,
      //   activeTabId: 'new-lobby',
      //   onTabChange: () => {}
      // }}
    />
  )
}