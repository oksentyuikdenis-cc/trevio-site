import { default as React } from 'react';

export interface SelectOption {
    value: string;
    label: string;
}
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    helperText?: string;
    size?: 'sm' | 'md' | 'lg';
    options: SelectOption[];
}
/**
 * Meridian Select — for short, closed lists (≤10 items). Longer lists should use a searchable Dropdown instead.
 */
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
