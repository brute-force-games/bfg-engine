import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Avatar.module.css';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  alt?: string;
  src?: string;
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ alt, src, size = 'medium', className, children, ...props }, ref) => {
    const avatarClassName = classNames(
      styles.avatar,
      size !== 'medium' && styles[size],
      !src && children && styles.colorful,
      className
    );

    return (
      <div ref={ref} className={avatarClassName} {...props}>
        {src ? (
          <img className={styles.img} src={src} alt={alt} />
        ) : (
          children
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

