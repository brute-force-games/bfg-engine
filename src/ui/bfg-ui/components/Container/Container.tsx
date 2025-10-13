import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Container.module.css';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
  children?: React.ReactNode;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'lg', disableGutters = false, className, children, ...props }, ref) => {
    const containerClassName = classNames(
      styles.container,
      maxWidth && styles[`maxWidth${maxWidth.charAt(0).toUpperCase()}${maxWidth.slice(1)}`],
      disableGutters && styles.disableGutters,
      className
    );

    return (
      <div ref={ref} className={containerClassName} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

