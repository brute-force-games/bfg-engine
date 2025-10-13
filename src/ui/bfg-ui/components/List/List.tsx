import React from 'react';
import { classNames } from '../../utils/classNames';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  dense?: boolean;
  children?: React.ReactNode;
}

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ dense = false, className, children, ...props }, ref) => {
    return (
      <ul ref={ref} className={className} style={{ listStyle: 'none', margin: 0, padding: dense ? '4px 0' : '8px 0', position: 'relative' }} {...props}>
        {children}
      </ul>
    );
  }
);

List.displayName = 'List';

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  button?: boolean;
  dense?: boolean;
  children?: React.ReactNode;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ button = false, dense = false, className, children, ...props }, ref) => {
    return (
      <li ref={ref} className={className} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', textDecoration: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'left', padding: dense ? '4px 16px' : '8px 16px', cursor: button ? 'pointer' : 'default' }} {...props}>
        {children}
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';

export const ListItemText: React.FC<{ primary?: React.ReactNode; secondary?: React.ReactNode; className?: string }> = ({ primary, secondary, className }) => {
  return (
    <div className={className} style={{ flex: '1 1 auto', minWidth: 0, marginTop: '4px', marginBottom: '4px' }}>
      {primary && <span style={{ display: 'block', fontSize: '1rem', fontWeight: 400, lineHeight: '1.5' }}>{primary}</span>}
      {secondary && <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.43' }}>{secondary}</p>}
    </div>
  );
};

