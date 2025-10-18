import { useMyPlayerProfiles, useRiskyMyDefaultPlayerProfile } from "../../../hooks/stores/use-my-player-profiles-store";
import { AppBarTabItem } from "../bfg-app-bar/app-bar-tab-item";
import { NoActivityNoUserAppBar } from "./no-activity-no-user-app-bar";
import { NoActivityUserAppBar } from "./no-activity-user-app-bar";


interface NoActivityAppBarProps {
  tabItems: AppBarTabItem[];
  activeTabId: string;
}

export const NoActivityAppBar = (props: NoActivityAppBarProps) => {
  const { tabItems, activeTabId } = props;

  const myPlayerProfiles = useMyPlayerProfiles();
  const myDefaultPlayerProfile = useRiskyMyDefaultPlayerProfile();

  console.log("NO ACTIVITY APP BAR");
  console.log("myPlayerProfiles", myPlayerProfiles);
  console.log("myDefaultPlayerProfile", myDefaultPlayerProfile);

  if (myPlayerProfiles.length === 0 || myDefaultPlayerProfile === null) {
    return <NoActivityNoUserAppBar />;
  }

  return (
    <NoActivityUserAppBar
      myPlayerProfiles={myPlayerProfiles}
      myDefaultPlayerProfile={myDefaultPlayerProfile}
    />
  )
}