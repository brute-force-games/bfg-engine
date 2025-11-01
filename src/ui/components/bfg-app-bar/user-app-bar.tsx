import { PrivatePlayerProfile } from "../../../models/player-profile/private-player-profile";
import { BruteForceGamesAppBar } from "./app-bar";
import { NavSpine } from "./nav-spine";
import { AppBarTabItem } from "./tab-item-hook";


interface BruteForceGamesUserAppBarProps {
  myPlayerProfiles: PrivatePlayerProfile[];
  myDefaultPlayerProfile: PrivatePlayerProfile | null;
}

export const BruteForceGamesUserAppBar = (_props: BruteForceGamesUserAppBarProps) => {


  const tabItems: AppBarTabItem[] = [
    {
      id: "home",
      label: "Home"
    },
    {
      id: "my-player-profiles",
      label: "My Profiles",
    }
  ]

  return (
    <BruteForceGamesAppBar>
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
