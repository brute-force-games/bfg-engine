import React from 'react';
import './Chip.css';

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
    const chipClassName = [
      'chip',
      size === 'small' && 'small',
      variant === 'outlined' && 'outlined',
      `color-${color}`,
      clickable && 'clickable',
      className
    ].filter(Boolean).join(' ');

    return (
      <Component ref={ref} className={chipClassName} {...props}>
        <span className="label">{label}</span>
      </Component>
    );
  }
);

Chip.displayName = 'Chip';

