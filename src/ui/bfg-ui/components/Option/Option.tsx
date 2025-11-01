import React from 'react';

export interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string | number;
  children: React.ReactNode;
}

export const Option: React.FC<OptionProps> = ({ children, ...props }) => {
  return (
    <option {...props}>
      {children}
    </option>
  );
};

Option.displayName = 'Option';

