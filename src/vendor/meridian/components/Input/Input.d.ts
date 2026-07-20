import { default as React } from 'react';

export type FieldSize = 'sm' | 'md' | 'lg';
export interface FieldProps {
    /** Persistent label — always shown, never replaced by a placeholder. */
    label?: string;
    /** Marks the field as required with a trailing asterisk. */
    required?: boolean;
    /** Helper text shown below the control; switches to error styling when `error` is set. */
    helperText?: string;
    error?: string;
    size?: FieldSize;
}
export interface InputProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
}
/**
 * Meridian Input — always paired with a persistent label, never placeholder-as-label.
 */
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export interface TextareaProps extends FieldProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
}
/**
 * Meridian Textarea — auto-growing up to 12 rows in product use; renders as a fixed-height field here.
 */
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
