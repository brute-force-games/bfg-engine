import { PrivatePlayerProfile } from "../../../models/player-profile/private-player-profile";
import { BruteForceGamesAppBar } from "./app-bar";


interface BruteForceGamesUserAppBarProps {
  myPlayerProfiles: PrivatePlayerProfile[];
  myDefaultPlayerProfile: PrivatePlayerProfile | null;
}

export const BruteForceGamesUserAppBar = (props: BruteForceGamesUserAppBarProps) => {
  // const { myPlayerProfiles, myDefaultPlayerProfile } = props;
  
  // const myPlayerProfiles = useMyPlayerProfiles();
  // const myDefaultPlayerProfile = useMyDefaultPlayerProfile();

  return (
    <BruteForceGamesAppBar 
      tabItems={[
        {
          id: "home",
          label: "Home"
        }
      ]}
      activeTabId="home"
      onTabChange={() => {}}
    />
  )
  
  // return (
  //   <AppBar 
  //     position="static" 
  //     style={{ 
  //       width: '100%',
  //       maxWidth: '100vw',
  //       overflow: 'visible'
  //     }}
  //   >
  //     <Toolbar style={{ 
  //       width: '100%',
  //       maxWidth: '100%',
  //       padding: '0 16px',
  //       overflow: 'visible',
  //       minHeight: '64px',
  //       boxSizing: 'border-box',
  //       display: 'flex',
  //       justifyContent: 'space-between',
  //       alignItems: 'center'
  //     }}>
  //       <Typography
  //         variant="h6"
  //         component="div"
  //         style={{ fontWeight: 'bold', flexShrink: 0 }}
  //       >
  //         <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
  //           Brute Force Games Starter
  //         </Link>
  //       </Typography>
        
  //       <Box style={{ 
  //         display: 'flex', 
  //         gap: '16px',
  //         flexShrink: 1,
  //         minWidth: 0,
  //         alignItems: 'center',
  //         flexGrow: 1,
  //         justifyContent: 'center'
  //       }}>
  //         <Link to="/new-lobby" style={{ textDecoration: 'none' }}>
  //           <Button variant="text" style={{ color: 'inherit' }}>Play Now</Button>
  //         </Link>
  //         {/* <Link to="/games-list" style={{ textDecoration: 'none' }}>
  //           <Button variant="text" style={{ color: 'inherit' }}>Games List</Button>
  //         </Link> */}
  //         <Link to="/my-hosted-games" style={{ textDecoration: 'none' }}>
  //           <Button variant="text" style={{ color: 'inherit' }}>My Hosted Games</Button>
  //         </Link>
  //         {/* Always show Player Profiles link, but disable if no profiles */}
  //           {myPlayerProfiles && myPlayerProfiles.length > 0 ? (
  //             <Link to="/my-player-profiles" style={{ textDecoration: 'none' }}>
  //               <Button variant="text" style={{ color: 'inherit' }}>Player Profiles</Button>
  //             </Link>
  //           ) : (
  //             <Button variant="text" style={{ color: 'inherit' }} disabled>
  //               Player Profiles
  //             </Button>
  //           )}
  //         {/* <Link to="/games-shelf" style={{ textDecoration: 'none' }}>
  //           <Button variant="text" style={{ color: 'inherit' }}>Games Shelf</Button>
  //         </Link>
  //         <Link to="/active-tables" style={{ textDecoration: 'none' }}>
  //           <Button variant="text" style={{ color: 'inherit' }}>Active Tables</Button>
  //         </Link>
  //         <Link to="/finished-games" style={{ textDecoration: 'none' }}>
  //           <Button variant="text" style={{ color: 'inherit' }}>Finished Games</Button>
  //         </Link>
  //         <Link to="/notifications" style={{ textDecoration: 'none' }}>
  //           <Button variant="text" style={{ color: 'inherit' }}>{notificationLinkTitle}</Button>
  //         </Link> */}

  //       </Box>
        
  //       <UserProfileAccessComponent
  //         myPlayerProfiles={myPlayerProfiles}
  //         myDefaultPlayerProfile={myDefaultPlayerProfile}
  //       />

  //       {/* User profile access removed - local-only mode */}

  //     </Toolbar>
  //   </AppBar>
  // )
}
