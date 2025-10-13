import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Chip.module.css';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default';
  clickable?: boolean;
  component?: React.ElementType;
}

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ 
    label, 
    size = 'medium', 
    variant = 'filled',
    color = 'default',
    clickable = false, 
    component: Component = 'div', 
    className, 
    ...props 
  }, ref) => {
    const chipClassName = classNames(
      styles.chip,
      size === 'small' && styles.small,
      variant === 'outlined' && styles.outlined,
      styles[`color-${color}`],
      clickable && styles.clickable,
      className
    );

    return (
      <Component ref={ref} className={chipClassName} {...props}>
        <span className={styles.label}>{label}</span>
      </Component>
    );
  }
);

Chip.displayName = 'Chip';

