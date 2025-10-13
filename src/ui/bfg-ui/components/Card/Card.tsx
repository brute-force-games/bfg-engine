import React from 'react';
import { Paper, PaperProps } from '../Paper';
import { classNames } from '../../utils/classNames';
import styles from './Card.module.css';

export interface CardProps extends PaperProps {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Paper ref={ref} className={classNames(styles.card, className)} {...props}>
        {children}
      </Paper>
    );
  }
);

Card.displayName = 'Card';

