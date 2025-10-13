import React, { useEffect } from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Dialog.module.css';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  children,
  className,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={classNames(styles.dialog, className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export const DialogTitle: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <h2 className={classNames(styles.dialogTitle, className)}>{children}</h2>;
};

export const DialogContent: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={classNames(styles.dialogContent, className)}>{children}</div>;
};

export const DialogActions: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={classNames(styles.dialogActions, className)}>{children}</div>;
};

