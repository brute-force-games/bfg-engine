import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Stack.module.css';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  spacing?: 0 | 1 | 2 | 3 | 4 | 6 | 8;
  divider?: React.ReactNode;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  useFlexGap?: boolean;
  children?: React.ReactNode;
  component?: React.ElementType;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    { 
      direction = 'column', 
      spacing = 0, 
      divider, 
      flexWrap,
      alignItems,
      justifyContent,
      useFlexGap,
      component: Component = 'div', 
      className, 
      children,
      style,
      ...props 
    },
    ref
  ) => {
    const stackClassName = classNames(
      styles.stack,
      styles[`direction${direction.charAt(0).toUpperCase()}${direction.slice(1).replace('-', '')}`],
      spacing > 0 && !useFlexGap && styles[`spacing-${spacing}`],
      divider && styles.divider,
      className
    );

    const inlineStyles: React.CSSProperties = {
      ...style,
      ...(flexWrap && { flexWrap }),
      ...(alignItems && { alignItems }),
      ...(justifyContent && { justifyContent }),
      ...(useFlexGap && spacing > 0 && { gap: `${spacing * 8}px` })
    };

    const childrenArray = React.Children.toArray(children);

    return (
      <Component ref={ref} className={stackClassName} style={inlineStyles} {...props}>
        {divider
          ? childrenArray.map((child, index) => (
              <React.Fragment key={index}>
                {child}
                {index < childrenArray.length - 1 && divider}
              </React.Fragment>
            ))
          : children}
      </Component>
    );
  }
);

Stack.displayName = 'Stack';

