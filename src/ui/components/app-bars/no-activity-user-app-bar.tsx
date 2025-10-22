import { PrivatePlayerProfile } from "../../../models/player-profile/private-player-profile";
import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar";


interface NoActivityUserAppBarProps {
  myPlayerProfiles: PrivatePlayerProfile[];
  myDefaultPlayerProfile: PrivatePlayerProfile | null;
}

export const NoActivityUserAppBar = (_props: NoActivityUserAppBarProps) => {
  // const { myPlayerProfiles, myDefaultPlayerProfile } = props;

  // const myPlayerProfiles = useMyPlayerProfiles();
  // const myDefaultPlayerProfile = useMyDefaultPlayerProfile();

  return (
    <BruteForceGamesAppBar 
      tabsConfig={{
        tabItems: [
        {
          id: "new-lobby",
          label: "Create Lobby",          
          link: {
            to: "/new-lobby"
          }
        }
        ],
        activeTabId: "new-lobby",
        onTabChange: () => {}
      }}
    />
  )
}
