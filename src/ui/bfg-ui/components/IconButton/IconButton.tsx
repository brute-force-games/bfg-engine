import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './IconButton.module.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'default' | 'primary' | 'secondary' | 'error';
  size?: 'small' | 'medium' | 'large';
  edge?: 'start' | 'end' | false;
  children?: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ color = 'default', size = 'medium', edge = false, className, children, ...props }, ref) => {
    const iconButtonClassName = classNames(
      styles.iconButton,
      color !== 'default' && styles[color],
      size !== 'medium' && styles[size],
      edge && styles[`edge-${edge}`],
      className
    );

    return (
      <button ref={ref} className={iconButtonClassName} {...props}>
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

