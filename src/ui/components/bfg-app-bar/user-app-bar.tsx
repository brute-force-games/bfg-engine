import { PrivatePlayerProfile } from "../../../models/player-profile/private-player-profile";
import { BruteForceGamesAppBar } from "./app-bar";


interface BruteForceGamesUserAppBarProps {
  myPlayerProfiles: PrivatePlayerProfile[];
  myDefaultPlayerProfile: PrivatePlayerProfile | null;
}

export const BruteForceGamesUserAppBar = (_props: BruteForceGamesUserAppBarProps) => {

  return (
    <BruteForceGamesAppBar 
      tabsConfig={{
        tabItems: [
        {
          id: "home",
          label: "Home"
        },
        {
          id: "my-player-profiles",
          label: "My Profiles",
          link: { to: "/my-player-profiles" }
        }
      ],
      activeTabId: "home",
      onTabChange: () => {}
    }}
    />
  )
}
