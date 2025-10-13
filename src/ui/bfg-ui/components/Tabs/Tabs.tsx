import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Tabs.module.css';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onChange, className, children, ...props }) => {
  const tabsClassName = classNames(styles.tabs, className);

  return (
    <div className={tabsClassName} role="tablist" {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            selected: value === index,
            onClick: (e: React.SyntheticEvent) => onChange(e, index),
          } as any);
        }
        return child;
      })}
    </div>
  );
};

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactElement;
  selected?: boolean;
  children?: React.ReactNode;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ label, icon, selected = false, className, children, ...props }, ref) => {
    const tabClassName = classNames(
      styles.tab,
      selected && styles.selected,
      className
    );

    return (
      <button ref={ref} role="tab" className={tabClassName} {...props}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {label || children}
      </button>
    );
  }
);

Tab.displayName = 'Tab';

