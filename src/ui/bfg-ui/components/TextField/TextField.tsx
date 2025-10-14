import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './TextField.module.css';

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  multiline?: boolean;
  rows?: number;
  InputProps?: {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
  };
}

export const TextField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      label,
      error = false,
      helperText,
      fullWidth = false,
      size = 'medium',
      variant = 'outlined',
      multiline = false,
      rows,
      InputProps,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textfield-${Math.random().toString(36).substr(2, 9)}`;
    const hasValue = props.value !== undefined && props.value !== '';

    const rootClassName = classNames(
      styles.textFieldRoot,
      error && styles.error,
      fullWidth && styles.fullWidth,
      size !== 'medium' && styles[size],
      variant !== 'outlined' && styles[`variant-${variant}`],
      multiline && styles.multiline,
      className
    );

    const inputWrapperClassName = classNames(
      styles.inputWrapper,
      !!InputProps?.startAdornment && styles.hasStartAdornment,
      !!InputProps?.endAdornment && styles.hasEndAdornment
    );

    const inputClassName = classNames(
      styles.input,
      hasValue && styles.inputFilled
    );

    const InputComponent = multiline ? 'textarea' : 'input';

    return (
      <div className={rootClassName}>
        <div className={inputWrapperClassName}>
          {InputProps?.startAdornment && (
            <div className={styles.startAdornment}>{InputProps.startAdornment}</div>
          )}
          <InputComponent
            ref={ref as any}
            id={inputId}
            className={inputClassName}
            placeholder=" "
            rows={multiline ? rows : undefined}
            {...props}
          />
          {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
          {InputProps?.endAdornment && (
            <div className={styles.endAdornment}>{InputProps.endAdornment}</div>
          )}
        </div>
        {helperText && <div className={styles.helperText}>{helperText}</div>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

