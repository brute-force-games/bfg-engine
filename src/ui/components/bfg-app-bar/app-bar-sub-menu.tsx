import { useState } from "react";
import { ArrowRight, Menu, MenuItem, Typography } from "../../bfg-ui/index";
import { SubMenu } from "./app-bar-menu";


interface IMwAppBarSubMenuProps {
  menuItem: SubMenu;
  areSubmenusOpen: boolean;
  handleOpenSubmenu: () => void;
  handleMenuClose: () => void;
}

export const DbkAppBarSubMenu = ({ menuItem, areSubmenusOpen, handleOpenSubmenu, handleMenuClose }: IMwAppBarSubMenuProps) => {

  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleSubmenuOpen = (event: React.MouseEvent<HTMLElement>) => {

    console.log('handleSubmenuOpen', event.currentTarget);
    setSubmenuAnchorEl(event.currentTarget);
    handleOpenSubmenu();
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
  };

  const toggleSubmenu = (event: React.MouseEvent<HTMLElement>) => {
    if (submenuAnchorEl) {
      handleSubmenuClose();
    } else {
      handleSubmenuOpen(event);
    }
  }

  return (
    <MenuItem
      key={menuItem.title}
      onClick={toggleSubmenu}
      onMouseLeave={handleSubmenuClose}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      
      <Typography style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>{menuItem.title} <ArrowRight /></Typography>
      {areSubmenusOpen && (
        <Menu
          anchorEl={submenuAnchorEl}
          open={Boolean(submenuAnchorEl)}
          onClose={handleSubmenuClose}
          anchorOrigin={{ 
            vertical: 'top', 
            horizontal: 'left' 
          }}
          transformOrigin={{ 
            vertical: 'top', 
            horizontal: 'right' 
          }}
        >
        {
          menuItem.subMenuItems.map((subMenuItem) => (
            <MenuItem
              key={subMenuItem.title}
              onClick={async () => {
                if (subMenuItem.type === 'sub-menu-action') {
                  await subMenuItem.action();
                }
                handleMenuClose();
              }}
            >
              <Typography style={{ textAlign: 'center' }}>{subMenuItem.title}</Typography>
            </MenuItem>
          ))
        }
      </Menu>
      )}
    </MenuItem>
  )
}
