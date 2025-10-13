import React, { useEffect, useRef } from 'react';
import { Paper } from '../Paper';
import { classNames } from '../../utils/classNames';
import styles from './Menu.module.css';

export interface MenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  children?: React.ReactNode;
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({
  open,
  anchorEl,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  children,
  className,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !anchorEl || !menuRef.current) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const menuEl = menuRef.current;

    let top = 0;
    let left = 0;

    // Calculate vertical position
    if (anchorOrigin.vertical === 'top') {
      top = anchorRect.top;
    } else if (anchorOrigin.vertical === 'bottom') {
      top = anchorRect.bottom;
    } else {
      top = anchorRect.top + anchorRect.height / 2;
    }

    // Calculate horizontal position
    if (anchorOrigin.horizontal === 'left') {
      left = anchorRect.left;
    } else if (anchorOrigin.horizontal === 'right') {
      left = anchorRect.right;
    } else {
      left = anchorRect.left + anchorRect.width / 2;
    }

    // Apply transform origin adjustments
    if (transformOrigin.vertical === 'top') {
      // No adjustment needed
    } else if (transformOrigin.vertical === 'bottom') {
      top -= menuEl.offsetHeight;
    } else {
      top -= menuEl.offsetHeight / 2;
    }

    if (transformOrigin.horizontal === 'left') {
      // No adjustment needed
    } else if (transformOrigin.horizontal === 'right') {
      left -= menuEl.offsetWidth;
    } else {
      left -= menuEl.offsetWidth / 2;
    }

    menuEl.style.top = `${top}px`;
    menuEl.style.left = `${left}px`;
  }, [open, anchorEl, anchorOrigin, transformOrigin]);

  if (!open) return null;

  return (
    <div ref={menuRef} className={classNames(styles.menu, className)}>
      <Paper elevation={8} className={styles.paper}>
        <ul className={styles.list}>{children}</ul>
      </Paper>
    </div>
  );
};

