import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../utils/classNames';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactElement;
  className?: string;
  disablePortal?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  placement = 'top',
  children,
  className,
  disablePortal = false,
}) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);

  if (!title) {
    return children;
  }

  const handleMouseEnter = () => {
    setShow(true);
    if (disablePortal && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ top: rect.top, left: rect.left });
    }
  };
  
  const handleMouseLeave = () => setShow(false);

  useEffect(() => {
    if (show && !disablePortal && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ top: rect.top, left: rect.left });
    }
  }, [show, disablePortal]);

  const tooltipContentClassName = classNames(
    styles.tooltipContent,
    styles[placement],
    show && styles.show
  );

  const clonedChild = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  } as any);

  // Non-portal version (original behavior)
  if (disablePortal) {
    return (
      <span className={classNames(styles.tooltip, className)}>
        {clonedChild}
        <span className={tooltipContentClassName}>{title}</span>
      </span>
    );
  }

  // Portal version - render tooltip at document body level
  const tooltipContent = show ? (
    <span 
      className={tooltipContentClassName}
      style={{
        position: 'fixed',
        top: placement === 'bottom' ? position.top + (triggerRef.current?.offsetHeight || 0) + 8 : 
             placement === 'top' ? position.top - 8 :
             position.top + ((triggerRef.current?.offsetHeight || 0) / 2),
        left: placement === 'right' ? position.left + (triggerRef.current?.offsetWidth || 0) + 8 :
              placement === 'left' ? position.left - 8 :
              position.left + ((triggerRef.current?.offsetWidth || 0) / 2),
        transform: placement === 'top' ? 'translateX(-50%) translateY(-100%)' :
                   placement === 'bottom' ? 'translateX(-50%)' :
                   placement === 'left' ? 'translateX(-100%) translateY(-50%)' :
                   'translateY(-50%)',
        minWidth: '150px',
        maxWidth: '300px',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      }}
    >
      {title}
    </span>
  ) : null;

  return (
    <>
      <span className={classNames(styles.tooltip, className)} style={{ display: 'block', width: '100%' }}>
        {clonedChild}
      </span>
      {createPortal(tooltipContent, document.body)}
    </>
  );
};

