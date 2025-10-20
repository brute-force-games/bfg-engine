import React from 'react';
import styles from './Checkbox.module.css';
import { classNames } from '../../utils/classNames';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  label?: React.ReactNode;
  labelClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, color = 'primary', label, labelClassName, ...props }, ref) => {
    const checkbox = (
      <input
        ref={ref}
        type="checkbox"
        className={classNames(styles.checkbox, styles[`checkbox--${color}`], className)}
        {...props}
      />
    );

    if (label) {
      return (
        <label className={classNames(styles.checkboxLabel, labelClassName)}>
          {checkbox}
          <span className={styles.labelText}>{label}</span>
        </label>
      );
    }

    return checkbox;
  }
);

Checkbox.displayName = 'Checkbox';

