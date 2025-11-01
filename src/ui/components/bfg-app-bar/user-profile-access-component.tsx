import { Avatar, Box, IconButton, Tooltip } from "../../bfg-ui/index"
import { DbkAppBarMenu, DbkAppBarMenuItem } from "../app-bar-menu/app-bar-menu"
import { useState } from "react";
import { PrivatePlayerProfile } from "../../../models/player-profile/private-player-profile";
import { useHostedGameActions } from "../../../hooks/stores/use-hosted-games-store";
import { AppSettingsDialog } from "../app-settings/app-settings-dialog";


interface UserProfileAccessComponentProps {
  myPlayerProfiles: PrivatePlayerProfile[];
  myDefaultPlayerProfile: PrivatePlayerProfile | null;
}

export const UserProfileAccessComponent = (props: UserProfileAccessComponentProps) => {

  const { myPlayerProfiles, myDefaultPlayerProfile } = props;
  const { clearAllStores } = useHostedGameActions();
  
  // Debug logging
  // console.log('UserProfileAccessComponent rendered with:', {
  //   myPlayerProfiles,
  //   myDefaultPlayerProfile,
  //   profilesCount: myPlayerProfiles?.length || 0
  // });

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isAppSettingsDialogOpen, setIsAppSettingsDialogOpen] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    // Remove focus from the button to prevent it from staying highlighted
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleOpenAppSettingsDialog = async () => {
    setIsAppSettingsDialogOpen(true);
    handleCloseUserMenu();
  };

  const handleCloseAppSettingsDialog = () => {
    setIsAppSettingsDialogOpen(false);
  };

  const handleClearAllStores = async () => {
    if (window.confirm('Are you sure you want to clear ALL stores (games, lobbies, and actions)? This action cannot be undone.')) {
      clearAllStores();
      console.log('All stores cleared successfully');
    }
  };

  const userName = myDefaultPlayerProfile?.handle || myPlayerProfiles[0]?.handle || 'User';

  const menuItems: DbkAppBarMenuItem[] = [
    { type: 'menu-label', title: userName },
    { type: 'menu-divider' },
    { type: 'menu-link', title: 'My Profiles', link: { to: '/my-player-profiles' } },
    // { type: 'menu-link', title: 'Gaming Groups', link: { to: '/gaming-groups' } },
    // { type: 'menu-link', title: 'My Friends', link: { to: '/my-friends' } },
    { type: 'menu-divider' },
    { type: 'menu-action', title: 'App Settings', action: handleOpenAppSettingsDialog },
    { type: 'menu-action', title: 'Clear All Stores', action: handleClearAllStores },
    { type: 'menu-anchor', title: 'BFG Starter on Github', href: 'https://github.com/brute-force-games/bfg-starter' },
    // { type: 'menu-action', title: 'Download Profile Backup', action: doDownloadProfileBackup },
  ];
  
  const avatarImageUrl = '';
  
  return (
    <Box style={{ 
      flexShrink: 0,
      minWidth: 'fit-content',
      // Temporary debug styling
      border: '2px solid red',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      padding: '4px'
    }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} style={{ padding: 0 }}>
          <Avatar 
            src={avatarImageUrl} 
            alt={userName}
            style={{ 
              width: 40, 
              height: 40,
              backgroundColor: '#1976d2',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <DbkAppBarMenu
        anchorElUser={anchorElUser}
        userMenuItems={menuItems}
        handleCloseUserMenu={handleCloseUserMenu}
      />
      <AppSettingsDialog
        open={isAppSettingsDialogOpen}
        onClose={handleCloseAppSettingsDialog}
      />
    </Box>  
  )
}
