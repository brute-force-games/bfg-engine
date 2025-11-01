import React, { useId } from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Select.module.css';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, fullWidth = false, error = false, className, children, id, ...props }) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={classNames(styles.selectRoot, fullWidth && styles.fullWidth, error && styles.error, className)}>
      <select id={selectId} className={classNames(styles.select, error && styles.error)} {...props}>
        {children}
      </select>
      {label && <label htmlFor={selectId} className={styles.label}>{label}</label>}
    </div>
  );
};

Select.displayName = 'Select';

