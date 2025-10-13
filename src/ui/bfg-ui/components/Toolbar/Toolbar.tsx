import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Toolbar.module.css';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'regular' | 'dense';
  disableGutters?: boolean;
  children?: React.ReactNode;
}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ variant = 'regular', disableGutters = false, className, children, ...props }, ref) => {
    const toolbarClassName = classNames(
      styles.toolbar,
      variant === 'dense' && styles.dense,
      disableGutters && styles.disableGutters,
      className
    );

    return (
      <div ref={ref} className={toolbarClassName} {...props}>
        {children}
      </div>
    );
  }
);

Toolbar.displayName = 'Toolbar';

