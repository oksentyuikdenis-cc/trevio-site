import { default as React } from 'react';

export interface TableColumn<T> {
    key: string;
    header: string;
    align?: 'left' | 'right';
    render: (row: T) => React.ReactNode;
}
export interface TableProps<T> {
    columns: TableColumn<T>[];
    rows: T[];
    rowKey: (row: T) => string;
}
/**
 * Meridian Table — numeric columns are always right-aligned with tabular figures;
 * text columns are always left-aligned. Never center-align a data column.
 */
export declare function Table<T>({ columns, rows, rowKey }: TableProps<T>): React.JSX.Element;
