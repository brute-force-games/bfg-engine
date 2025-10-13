import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Divider.module.css';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'inset' | 'middle';
  light?: boolean;
  component?: React.ElementType;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = 'horizontal', light = false, component: Component = 'hr', className, ...props }, ref) => {
    const dividerClassName = classNames(
      styles.divider,
      orientation === 'vertical' && styles.vertical,
      light && styles.light,
      className
    );

    return <Component ref={ref} className={dividerClassName} {...props} />;
  }
);

Divider.displayName = 'Divider';

