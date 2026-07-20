import { default as React } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual style. Use `primary` at most once per view. */
    variant?: ButtonVariant;
    /** Control height and padding. */
    size?: ButtonSize;
    /** Shows a spinner and locks the button's resting width. */
    loading?: boolean;
    /** Icon element rendered before the label. */
    leadingIcon?: React.ReactNode;
    children?: React.ReactNode;
}
/**
 * Meridian Button — the primary interactive control.
 * Labels should always be a verb phrase naming the outcome ("Create report"), never a generic noun.
 */
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
