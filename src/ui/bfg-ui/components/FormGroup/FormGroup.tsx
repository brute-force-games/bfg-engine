import React from 'react';
import styles from './FormGroup.module.css';
import { classNames } from '../../utils/classNames';

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  row?: boolean;
}

export const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ children, className, row, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          styles.formGroup,
          row && styles['formGroup--row'],
          className
        )}
        role="group"
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormGroup.displayName = 'FormGroup';

