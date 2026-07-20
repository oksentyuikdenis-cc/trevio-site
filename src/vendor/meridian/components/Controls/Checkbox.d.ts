import { default as React } from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
}
/** Meridian Checkbox — the checkbox and its label are one hit target. */
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
