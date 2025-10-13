import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Paper.module.css';

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 0 | 1 | 2 | 3 | 4 | 8;
  variant?: 'elevation' | 'outlined';
  square?: boolean;
  children?: React.ReactNode;
}

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ elevation = 1, variant = 'elevation', square = false, className, children, ...props }, ref) => {
    const paperClassName = classNames(
      styles.paper,
      variant === 'elevation' && styles[`elevation${elevation}`],
      variant === 'outlined' && styles.outlined,
      square && styles.square,
      className
    );

    return (
      <div ref={ref} className={paperClassName} {...props}>
        {children}
      </div>
    );
  }
);

Paper.displayName = 'Paper';

