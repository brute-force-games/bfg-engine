import { Divider, Menu, MenuItem, Typography } from "../../bfg-ui/index";
import { useState } from 'react';
import { BfgAppBarSubMenu } from './app-bar-sub-menu';
import { Link, LinkProps } from '@tanstack/react-router';


export type SubMenuAction = {
  type: 'sub-menu-action';
  title: string;
  action: () => Promise<void>;
}

export type SubMenuLink = {
  type: 'sub-menu-link';
  title: string;
  link: LinkProps;
}

export type SubMenuItem = SubMenuAction | SubMenuLink;

export type SubMenu = {
  type: 'sub-menu';
  title: string;
  subMenuItems: SubMenuItem[];
}

export type MenuAction = {
  type: 'menu-action';
  title: string;
  action: () => Promise<void>;
}

export type MenuLink = {
  type: 'menu-link';
  title: string;
  link: LinkProps;
}

export type MenuAnchor = {
  type: 'menu-anchor';
  title: string;
  href: string;
}

export type MenuDivider = { 
  type: 'menu-divider';
}

export type MenuLabel = {
  type: 'menu-label';
  title: string;
}

export type DbkAppBarMenuItem = MenuAction | MenuLink | MenuAnchor | SubMenu | MenuDivider | MenuLabel;

interface IDbkAppBarMenuProps {
  anchorElUser: null | HTMLElement;
  userMenuItems: DbkAppBarMenuItem[];
  handleCloseUserMenu: () => void;
}

export const DbkAppBarMenu = ({ anchorElUser, userMenuItems, handleCloseUserMenu }: IDbkAppBarMenuProps) => {

  const [areSubmenusOpen, setAreSubmenusOpen] = useState(false);

  const handleMenuClose = () => {
    handleCloseUserMenu();
    setAreSubmenusOpen(false);
  }

  const handleSubmenusClose = () => {
    setAreSubmenusOpen(false);
  }

  const handleOpenSubmenu = () => {
    setAreSubmenusOpen(true);
  };

  
  return (
    <Menu
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorElUser)}
      onClose={handleMenuClose}
    >
      {
        userMenuItems.map((menuItem, index) => {
          if (menuItem.type === 'menu-action') {
            return (
              <MenuItem
                key={`action-${menuItem.title}-${index}`}
                onClick={async () => {
                  await menuItem.action();
                  handleMenuClose();
                }}
                onMouseEnter={handleSubmenusClose}
                onMouseLeave={handleSubmenusClose}
              >
                <Typography style={{ textAlign: 'center' }}>{menuItem.title}</Typography>
              </MenuItem>
            )
          } else if (menuItem.type === 'menu-link') {
            return (
              <Link
                key={`link-${menuItem.title}-${index}`}
                to={menuItem.link.to as string}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Typography style={{ textAlign: 'center' }}>{menuItem.title}</Typography>
                </MenuItem>
              </Link>
            )
          } else if (menuItem.type === 'menu-anchor') {
            return (
              <MenuItem
                key={`anchor-${menuItem.title}-${index}`}
                onClick={handleMenuClose}
              >
                <a
                  href={menuItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
                >
                  <Typography style={{ textAlign: 'center' }}>{menuItem.title}</Typography>
                </a>
              </MenuItem>
            )
          } else if (menuItem.type === 'menu-divider') {
            return (
              <Divider key={index} />
            )
          } else if (menuItem.type === 'menu-label') {
            return (
              <Typography 
                key={index}
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: '10px',
                }}
              >
                {menuItem.title}
              </Typography>
            )
          } else {
            return (
              <BfgAppBarSubMenu
                key={index}
                menuItem={menuItem}
                areSubmenusOpen={areSubmenusOpen}
                handleOpenSubmenu={handleOpenSubmenu}
                handleMenuClose={handleMenuClose}
              />
            )
          }
        })
      }
    </Menu>
  )
}
