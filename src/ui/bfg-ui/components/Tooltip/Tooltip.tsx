import React, { useState } from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  placement = 'top',
  children,
  className,
}) => {
  const [show, setShow] = useState(false);

  if (!title) {
    return children;
  }

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);

  const tooltipContentClassName = classNames(
    styles.tooltipContent,
    styles[placement],
    show && styles.show
  );

  return (
    <span className={classNames(styles.tooltip, className)}>
      {React.cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      } as any)}
      <span className={tooltipContentClassName}>{title}</span>
    </span>
  );
};

