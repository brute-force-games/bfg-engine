import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from '../TextField/TextField.module.css';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, fullWidth = false, error = false, className, children, id, ...props }, ref) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={classNames(styles.textFieldRoot, fullWidth && styles.fullWidth, error && styles.error, className)}>
        <select ref={ref} id={inputId} className={styles.input} {...props}>
          {children}
        </select>
        {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      </div>
    );
  }
);

Select.displayName = 'Select';

