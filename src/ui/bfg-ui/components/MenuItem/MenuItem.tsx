import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './MenuItem.module.css';

export interface MenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  dense?: boolean;
  disabled?: boolean;
  component?: React.ElementType;
  children?: React.ReactNode;
}

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
  ({ dense = false, disabled = false, component: Component = 'li', className, children, onClick, ...props }, ref) => {
    const menuItemClassName = classNames(
      styles.menuItem,
      dense && styles.dense,
      className
    );

    // Handle both button and li elements properly
    if (Component === 'li') {
      return (
        <Component
          ref={ref}
          className={menuItemClassName}
          role="menuitem"
          onClick={onClick as any}
          {...props}
        >
          {children}
        </Component>
      );
    }

    return (
      <Component
        ref={ref}
        className={menuItemClassName}
        onClick={onClick}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

MenuItem.displayName = 'MenuItem';

