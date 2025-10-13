import React from 'react';
import styles from './Checkbox.module.css';
import { classNames } from '../../utils/classNames';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, color = 'primary', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={classNames(styles.checkbox, styles[`checkbox--${color}`], className)}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

