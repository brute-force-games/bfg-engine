import React from 'react';
import { classNames } from '../../utils/classNames';

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
  error?: boolean;
  component?: React.ElementType;
  children?: React.ReactNode;
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ fullWidth = false, error = false, component: Component = 'div', className, children, ...props }, ref) => {
    const formControlClassName = classNames(
      'bfg-form-control',
      fullWidth && 'bfg-form-control-full-width',
      error && 'bfg-form-control-error',
      className
    );

    return (
      <Component ref={ref} className={formControlClassName} style={{ display: 'inline-flex', flexDirection: 'column', position: 'relative', minWidth: 0, padding: 0, margin: 0, border: 0, verticalAlign: 'top', width: fullWidth ? '100%' : undefined }} {...props}>
        {children}
      </Component>
    );
  }
);

FormControl.displayName = 'FormControl';

export const FormLabel: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <label className={className} style={{ display: 'block', transformOrigin: 'top left', fontSize: '1rem', lineHeight: '1.4375em', color: 'rgba(0, 0, 0, 0.6)' }}>{children}</label>;
};

export const FormHelperText: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <p className={className} style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px', marginRight: '14px' }}>{children}</p>;
};

export const InputAdornment: React.FC<{ children?: React.ReactNode; position?: 'start' | 'end'; className?: string }> = ({ children, position = 'start', className }) => {
  return <div className={className} style={{ display: 'flex', height: '0.01em', maxHeight: '2em', alignItems: 'center', whiteSpace: 'nowrap', color: 'rgba(0, 0, 0, 0.54)', marginRight: position === 'start' ? '8px' : 0, marginLeft: position === 'end' ? '8px' : 0 }}>{children}</div>;
};

