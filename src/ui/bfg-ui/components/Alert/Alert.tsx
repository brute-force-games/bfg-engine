import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Alert.module.css';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  severity?: 'error' | 'warning' | 'info' | 'success';
  children?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ severity = 'info', className, children, ...props }, ref) => {
    const alertClassName = classNames(
      styles.alert,
      styles[`severity-${severity}`],
      className
    );

    return (
      <div ref={ref} role="alert" className={alertClassName} {...props}>
        {children}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

