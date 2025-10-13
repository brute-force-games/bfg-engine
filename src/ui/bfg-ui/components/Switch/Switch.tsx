import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked = false, className, ...props }, ref) => {
    return (
      <span className={classNames(styles.switch, className)}>
        <span className={classNames(styles.switchBase, checked && styles.checked)}>
          <span className={styles.thumb} />
          <input ref={ref} type="checkbox" className={styles.input} checked={checked} {...props} />
        </span>
        <span className={classNames(styles.track, checked && styles.checked)} />
      </span>
    );
  }
);

Switch.displayName = 'Switch';

