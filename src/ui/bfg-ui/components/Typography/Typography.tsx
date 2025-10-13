import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Typography.module.css';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button';
export type TypographyColor = 'primary' | 'secondary' | 'disabled' | 'error';
export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: TypographyAlign;
  gutterBottom?: boolean;
  noWrap?: boolean;
  component?: React.ElementType;
  children?: React.ReactNode;
}

const variantMapping: Record<TypographyVariant, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  button: 'span',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  gutterBottom = false,
  noWrap = false,
  component,
  className,
  children,
  ...props
}) => {
  const Component = component || variantMapping[variant];

  const typographyClassName = classNames(
    styles.typography,
    styles[variant],
    styles[color],
    align !== 'left' && styles[align],
    gutterBottom && styles.gutterBottom,
    noWrap && styles.noWrap,
    className
  );

  return <Component className={typographyClassName} {...props}>{children}</Component>;
};

