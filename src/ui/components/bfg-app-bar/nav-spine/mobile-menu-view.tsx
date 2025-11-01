import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconButton, MenuIcon, Menu, MenuItem, Box } from "~/ui/bfg-ui";
import { NavSpineProps } from "./types";


// interface MobileMenuViewProps<TTabId extends string = string> {
//   title: string;
//   tabItems: readonly AppBarTabItem<TTabId>[];
//   activeTabId: TTabId;
//   onTabChange: (tabId: TTabId) => void;
// }

export const MobileMenuView = <TTabId extends string = string>(props: NavSpineProps<TTabId>) => {

  const { title, tabItems, activeTabId, onTabChange } = props;

  const [navMenuAnchor, setNavMenuAnchor] = useState<null | HTMLElement>(null);

  const handleNavMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNavMenuAnchor(event.currentTarget);
  };
  
  const handleNavMenuClose = () => {
    setNavMenuAnchor(null);
  };


  return (
    <>
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
            {title}
          </Link>
        </MenuItem>
        
        {tabItems.map((tabItem) => {
          const isActive = activeTabId === tabItem.id;
          return (
            <MenuItem 
              key={tabItem.id} 
              onClick={() => onTabChange(tabItem.id)}
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
                  onClick={() => onTabChange(tabItem.id)}
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
      {/* <Box style={{ flexGrow: 1 }} />
      <UserProfileAccessComponent
        myPlayerProfiles={myPlayerProfiles}
        myDefaultPlayerProfile={myDefaultPlayerProfile}
      /> */}
    </>
  )
}