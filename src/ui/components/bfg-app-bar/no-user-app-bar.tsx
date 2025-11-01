import { BfgStarterNavBar } from "../bfg-nav-bar/bfg-starter-nav-bar"
import { AppBarTabItem } from "./tab-item-hook"


export const NoUserAppBar = () => {

  const tabItems: AppBarTabItem[] = [
    {
      id: "home",
      label: "Home"
    }
  ]

  return (
    <BfgStarterNavBar
      tabsConfig={{
        tabItems,
        activeTabId: "home",
        onTabChange: () => {}
      }}
    />
  )
}
