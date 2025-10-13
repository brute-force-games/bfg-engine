import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Box.module.css';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  component?: React.ElementType;
  children?: React.ReactNode;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ component: Component = 'div', className, children, style, ...props }, ref) => {
    const boxClassName = classNames(styles.box, className);

    return (
      <Component ref={ref} className={boxClassName} style={style} {...props}>
        {children}
      </Component>
    );
  }
);

Box.displayName = 'Box';

