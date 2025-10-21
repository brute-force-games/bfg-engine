import { useState, useEffect } from "react";
import { AppBar, Box, Button, Toolbar, Typography, IconButton, Menu, MenuItem } from "../../bfg-ui/index";
import { MenuIcon } from "../../bfg-ui/icons";
import { Link } from '@tanstack/react-router';
import { useRiskyMyDefaultPlayerProfile, useMyPlayerProfiles } from "../../../hooks/stores/use-my-player-profiles-store";
import { UserProfileAccessComponent } from "./user-profile-access-component";
import { useGameHosting } from "../../../hooks/games-registry/game-hosting";
import { AppBarTabItem } from "./tab-item-hook";


interface BruteForceGamesAppBarProps<TTabId extends string = string> {
  tabsConfig: {
    tabItems: readonly AppBarTabItem<TTabId>[];
    activeTabId: TTabId;
    onTabChange?: (tabId: TTabId) => void;
  } | null;
}

export const BruteForceGamesAppBar = <TTabId extends string = string>(props: BruteForceGamesAppBarProps<TTabId>) => {
  
  const gameHosting = useGameHosting();
  const myPlayerProfiles = useMyPlayerProfiles();
  const myDefaultPlayerProfile = useRiskyMyDefaultPlayerProfile();

  const siteTitle = gameHosting.getSiteTitle();
  
  const [navMenuAnchor, setNavMenuAnchor] = useState<null | HTMLElement>(null);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsNarrowScreen(window.innerWidth < 768);
    };
    
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);
  
  const handleNavMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNavMenuAnchor(event.currentTarget);
  };
  
  const handleNavMenuClose = () => {
    setNavMenuAnchor(null);
  };
  
  return (
    <AppBar 
      position="static" 
      style={{ 
        width: '100%',
        maxWidth: '100vw',
        overflow: 'visible'
      }}
    >
      <Toolbar style={{ 
        width: '100%',
        maxWidth: '100%',
        padding: '0 16px',
        overflow: 'visible',
        minHeight: '64px',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {isNarrowScreen ? (
          <>
            {/* Mobile Layout */}
            <IconButton
              onClick={handleNavMenuOpen}
              style={{ color: 'inherit' }}
              aria-label="Open navigation menu"
            >
              <MenuIcon width={24} height={24} />
            </IconButton>
            <Menu
              anchorEl={navMenuAnchor}
              open={Boolean(navMenuAnchor)}
              onClose={handleNavMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={handleNavMenuClose}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  {siteTitle}
                </Link>
              </MenuItem>
              
              {props.tabsConfig?.tabItems.map((tabItem) => {
                const isActive = props.tabsConfig?.activeTabId === tabItem.id;
                return (
                  <MenuItem 
                    key={tabItem.id} 
                    onClick={() => props.tabsConfig?.onTabChange?.(tabItem.id)}
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      fontWeight: isActive ? 'bold' : 'normal'
                    }}
                  >
                    {tabItem.link ? (
                      <Link to={tabItem.link.to} style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {tabItem.icon}
                        {tabItem.label}
                      </Link>
                    ) : (
                      <Box 
                        onClick={() => props.tabsConfig?.onTabChange?.(tabItem.id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                      >
                        {tabItem.icon}
                        {tabItem.label}
                      </Box>
                    )}
                  </MenuItem>
                );
              })}
            </Menu>
            <Box style={{ flexGrow: 1 }} />
            <UserProfileAccessComponent
              myPlayerProfiles={myPlayerProfiles}
              myDefaultPlayerProfile={myDefaultPlayerProfile}
            />
          </>
        ) : (
          <>
            {/* Desktop Layout */}
            <Typography
              variant="h6"
              component="div"
              style={{ fontWeight: 'bold', flexShrink: 0 }}
            >
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                {siteTitle}
              </Link>
            </Typography>
            
            <Box style={{ 
              display: 'flex', 
              gap: '16px',
              flexShrink: 1,
              minWidth: 0,
              alignItems: 'center',
              flexGrow: 1,
              justifyContent: 'center'
            }}>

            {props.tabsConfig?.tabItems.map((tabItem) => {
              const isActive = props.tabsConfig?.activeTabId === tabItem.id;
              return tabItem.link ? (
                <Link key={tabItem.id} to={tabItem.link.to} style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="text" 
                    style={{ 
                      color: 'inherit',
                      fontWeight: isActive ? 'bold' : 'normal',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      outline: 'none'
                    }}
                  >
                    {tabItem.icon}
                    {tabItem.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={tabItem.id}
                  variant="text"
                  style={{ 
                    color: 'inherit',
                    fontWeight: isActive ? 'bold' : 'normal',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    outline: 'none'
                  }}
                  onClick={() => props.tabsConfig?.onTabChange?.(tabItem.id)}
                >
                  {tabItem.icon}
                  {tabItem.label}
                </Button>
              );
            })}

            </Box>
            
            <UserProfileAccessComponent
              myPlayerProfiles={myPlayerProfiles}
              myDefaultPlayerProfile={myDefaultPlayerProfile}
            />
          </>
        )}

      </Toolbar>
    </AppBar>
  )
}
