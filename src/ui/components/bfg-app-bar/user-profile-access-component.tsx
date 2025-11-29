import { Avatar, Box, IconButton } from "../../bfg-ui/index"
import { DbkAppBarMenu, DbkAppBarMenuItem } from "../app-bar-menu/app-bar-menu"
import { useState, useContext } from "react";
import { PrivatePlayerProfile } from "../../../models/internal/player-profile/private-player-profile";
import { AppSettingsDialog } from "../app-settings/app-settings-dialog";
import { GameSettingsDialog } from "../app-settings/game-settings-dialog";
import { TableSettingsDialog } from "../app-settings/table-settings-dialog";
import { ObserverLinksDialog } from "../observer-links-dialog/observer-links-dialog";
import { OptionalGameContext, EMPTY_GAME_CONTEXT } from "../../../hooks/p2p/game/use-optional-game-context";
import { useAppSettings, useAppSettingsActions } from "../../../hooks/stores/use-my-app-settings-store";
import { useTbStoresManager } from "../../../hooks/games-registry/use-tb-stores-manager-hook";
import { BfgGameInstanceId } from "../../../models/types/bfg-branded-uuids";
import { P2pRawRoomContext } from "../../../hooks/p2p/game/p2p-raw-room-context";


interface UserProfileAccessComponentProps {
  myPlayerProfiles: PrivatePlayerProfile[];
  myDefaultPlayerProfile: PrivatePlayerProfile | null;
  gameContext?: OptionalGameContext;
}

export const UserProfileAccessComponent = (props: UserProfileAccessComponentProps) => {

  const { myPlayerProfiles, myDefaultPlayerProfile } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const gameContext = props.gameContext ?? EMPTY_GAME_CONTEXT;
  // const { clearAllStores } = useHostedGameActions();
  const { clearAllStores } = useTbStoresManager();
  const appSettings = useAppSettings();
  const { updateSettings } = useAppSettingsActions();
  
  // Debug logging
  // console.log('UserProfileAccessComponent rendered with:', {
  //   myPlayerProfiles,
  //   myDefaultPlayerProfile,
  //   profilesCount: myPlayerProfiles?.length || 0,
  //   gameContext
  // });

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isAppSettingsDialogOpen, setIsAppSettingsDialogOpen] = useState(false);
  const [isGameSettingsDialogOpen, setIsGameSettingsDialogOpen] = useState(false);
  const [isTableSettingsDialogOpen, setIsTableSettingsDialogOpen] = useState(false);
  const [isObserverLinksDialogOpen, setIsObserverLinksDialogOpen] = useState(false);

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

  const handleOpenGameSettingsDialog = async () => {
    if (gameContext.gameTitle) {
      setIsGameSettingsDialogOpen(true);
      handleCloseUserMenu();
    }
  };

  const handleCloseGameSettingsDialog = () => {
    setIsGameSettingsDialogOpen(false);
  };

  const handleOpenTableSettingsDialog = async () => {
    if (gameContext.gameTitle && gameContext.gameTableId) {
      setIsTableSettingsDialogOpen(true);
      handleCloseUserMenu();
    }
  };

  const handleCloseTableSettingsDialog = () => {
    setIsTableSettingsDialogOpen(false);
  };

  const handleOpenObserverLinksDialog = async () => {
    setIsObserverLinksDialogOpen(true);
    handleCloseUserMenu();
  };

  const handleCloseObserverLinksDialog = () => {
    setIsObserverLinksDialogOpen(false);
  };

  const handleClearAllStores = async () => {
    if (window.confirm('Are you sure you want to clear ALL stores (games, lobbies, and actions)? This action cannot be undone.')) {
      clearAllStores();
      console.log('All stores cleared successfully');
    }
  };

  const handleOpenDevToolsPage = async () => {
    window.open('/dev', '_blank');
    handleCloseUserMenu();
  };

  const handleToggleTinybaseInspector = async () => {
    const newValue = !appSettings.debugSettingShowTinybaseInspector;
    updateSettings({
      debugSettingShowTinybaseInspector: newValue,
    });
    handleCloseUserMenu();
  };

  const userName = myDefaultPlayerProfile?.handle || myPlayerProfiles[0]?.handle || 'User';

  // Determine if settings are enabled based on context
  const hasGameContext = gameContext.gameTitle !== null;
  const hasTableContext = gameContext.gameTitle !== null && gameContext.gameTableId !== null;

  // Try to get gameInstanceId from P2P context (if available)
  const p2pRawRoomContext = useContext(P2pRawRoomContext);
  const gameInstanceId: BfgGameInstanceId | null = p2pRawRoomContext?.gameInstanceId ?? null;
  const hasActiveGame = gameInstanceId !== null;

  const menuItems: DbkAppBarMenuItem[] = [
    { type: 'menu-label', title: userName },
    { type: 'menu-divider' },
    { type: 'menu-link', title: 'My Profiles', link: { to: '/my-player-profiles' } },
    // { type: 'menu-link', title: 'Gaming Groups', link: { to: '/gaming-groups' } },
    // { type: 'menu-link', title: 'My Friends', link: { to: '/my-friends' } },
    { type: 'menu-divider' },
    { type: 'menu-action', title: 'App Settings', action: handleOpenAppSettingsDialog },
    { 
      type: 'menu-action', 
      title: hasGameContext ? `Game Settings (${gameContext.gameTitle})` : 'Game Settings', 
      action: handleOpenGameSettingsDialog,
      disabled: !hasGameContext,
      disabledReason: 'Game Settings are available when viewing a specific game'
    },
    { 
      type: 'menu-action', 
      title: hasTableContext ? `Table Settings (${gameContext.tableName})` : 'Table Settings', 
      action: handleOpenTableSettingsDialog,
      disabled: !hasTableContext,
      disabledReason: 'Table Settings are available when playing at a specific table'
    },
    {
      type: 'menu-action',
      title: 'Observer Links',
      action: handleOpenObserverLinksDialog,
      disabled: !hasActiveGame,
      disabledReason: 'Observer links are available when viewing an active game'
    },
    {
      type: 'sub-menu',
      title: 'Dev Settings',
      subMenuItems: [
        { type: 'sub-menu-action', title: 'Clear All Stores', action: handleClearAllStores },
        { type: 'sub-menu-action', title: 'Dev Tools Page', action: handleOpenDevToolsPage },
        { type: 'sub-menu-action', title: `${appSettings.debugSettingShowTinybaseInspector ? 'Hide' : 'Show'} TinyBase Inspector`, action: handleToggleTinybaseInspector },
      ]
    },
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
      <DbkAppBarMenu
        anchorElUser={anchorElUser}
        userMenuItems={menuItems}
        handleCloseUserMenu={handleCloseUserMenu}
      />
      <AppSettingsDialog
        open={isAppSettingsDialogOpen}
        onClose={handleCloseAppSettingsDialog}
      />
      {hasGameContext && (
        <GameSettingsDialog
          open={isGameSettingsDialogOpen}
          onClose={handleCloseGameSettingsDialog}
          gameTitle={gameContext.gameTitle!}
        />
      )}
      {hasTableContext && 
      gameContext.gameTableId && (
        <TableSettingsDialog
          open={isTableSettingsDialogOpen}
          onClose={handleCloseTableSettingsDialog}
          gameTableId={gameContext.gameTableId}
          gameTitle={gameContext.gameTitle!}
          tableName={gameContext.tableName}
        />
      )}
      {hasActiveGame && gameInstanceId && (
        <ObserverLinksDialog
          open={isObserverLinksDialogOpen}
          onClose={handleCloseObserverLinksDialog}
          gameInstanceId={gameInstanceId}
        />
      )}
    </Box>  
  )
}
