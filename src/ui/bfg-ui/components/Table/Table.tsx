import React, { useState, useMemo } from 'react';
import { classNames } from '../../utils/classNames';
import { Typography } from '../Typography';
import { IconButton } from '../IconButton';
import styles from './Table.module.css';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  onSort?: (column: string, direction: SortDirection) => void;
  defaultSort?: {
    column: string;
    direction: SortDirection;
  };
  emptyMessage?: string;
  loading?: boolean;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  className,
  onSort,
  defaultSort,
  emptyMessage = 'No data available',
  loading = false,
}: TableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSort?.column || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSort?.direction || null);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    let newDirection: SortDirection = 'asc';
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      }
    }

    setSortColumn(newDirection ? columnKey : null);
    setSortDirection(newDirection);
    onSort?.(columnKey, newDirection);
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) return '↕️';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕️';
  };

  if (loading) {
    return (
      <div className={classNames(styles.tableContainer, className)}>
        <div className={styles.loading}>
          <Typography variant="body2" color="secondary">Loading...</Typography>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={classNames(styles.tableContainer, className)}>
        <div className={styles.empty}>
          <Typography variant="body2" color="secondary">{emptyMessage}</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.tableContainer, className)}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((column) => (
              <th
                key={column.key}
                className={classNames(
                  styles.headerCell,
                  column.sortable && styles.sortable,
                  column.align && styles[column.align]
                )}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className={styles.headerContent}>
                  <Typography variant="subtitle2" className={styles.headerText}>
                    {column.label}
                  </Typography>
                  {column.sortable && (
                    <span className={styles.sortIcon}>
                      {getSortIcon(column.key)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} className={styles.dataRow}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={classNames(
                    styles.dataCell,
                    column.align && styles[column.align]
                  )}
                >
                  {column.render ? (
                    column.render(row[column.key], row, index)
                  ) : (
                    <Typography variant="body2">
                      {row[column.key]}
                    </Typography>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
