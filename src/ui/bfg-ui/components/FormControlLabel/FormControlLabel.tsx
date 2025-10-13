import React from 'react';
import styles from './FormControlLabel.module.css';
import { classNames } from '../../utils/classNames';

export interface FormControlLabelProps {
  control: React.ReactElement;
  label: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const FormControlLabel = React.forwardRef<HTMLLabelElement, FormControlLabelProps>(
  ({ control, label, className, disabled }, ref) => {
    const controlElement = React.cloneElement(control, {
      disabled: disabled || control.props.disabled,
    });

    return (
      <label
        ref={ref}
        className={classNames(
          styles.formControlLabel,
          disabled && styles['formControlLabel--disabled'],
          className
        )}
      >
        {controlElement}
        <span className={styles.formControlLabel__label}>{label}</span>
      </label>
    );
  }
);

FormControlLabel.displayName = 'FormControlLabel';

