import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './AppBar.module.css';

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  color?: 'default' | 'primary' | 'secondary' | 'transparent';
  children?: React.ReactNode;
}

export const AppBar = React.forwardRef<HTMLElement, AppBarProps>(
  ({ position = 'fixed', color = 'primary', className, children, ...props }, ref) => {
    const appBarClassName = classNames(
      styles.appBar,
      position !== 'fixed' && styles[position],
      styles[`color${color.charAt(0).toUpperCase()}${color.slice(1)}`],
      className
    );

    return (
      <header ref={ref} className={appBarClassName} {...props}>
        {children}
      </header>
    );
  }
);

AppBar.displayName = 'AppBar';

