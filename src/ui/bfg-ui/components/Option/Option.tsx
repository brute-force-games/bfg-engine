import React from 'react';

export interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string | number;
  children: React.ReactNode;
}

export const Option = React.forwardRef<HTMLOptionElement, OptionProps>(
  ({ children, ...props }, ref) => {
    return (
      <option ref={ref} {...props}>
        {children}
      </option>
    );
  }
);

Option.displayName = 'Option';

