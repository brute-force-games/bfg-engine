import React from 'react';
import styles from './InputLabel.module.css';
import { classNames } from '../../utils/classNames';

export interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
}

export const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ children, className, required, disabled, error, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={classNames(
          styles.inputLabel,
          disabled && styles['inputLabel--disabled'],
          error && styles['inputLabel--error'],
          className
        )}
        {...props}
      >
        {children}
        {required && <span className={styles.inputLabel__required}> *</span>}
      </label>
    );
  }
);

InputLabel.displayName = 'InputLabel';

