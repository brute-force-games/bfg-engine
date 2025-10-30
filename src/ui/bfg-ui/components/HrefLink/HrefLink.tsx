import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './HrefLink.module.css';

export interface HrefLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
  openInNewTab?: boolean;
}

export const HrefLink = React.forwardRef<HTMLAnchorElement, HrefLinkProps>(
  (
    {
      href,
      variant = 'text',
      color = 'primary',
      size = 'medium',
      fullWidth = false,
      startIcon,
      endIcon,
      className,
      children,
      openInNewTab = true,
      ...props
    },
    ref
  ) => {
    const linkClassName = classNames(
      styles.hrefLink,
      styles[variant],
      styles[color],
      size !== 'medium' && styles[size],
      fullWidth && styles.fullWidth,
      className
    );

    const linkProps = {
      ...props,
      href,
      className: linkClassName,
      ...(openInNewTab && {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    };

    return (
      <a ref={ref} {...linkProps}>
        {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
        {children}
        {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
      </a>
    );
  }
);

HrefLink.displayName = 'HrefLink';
