import { default as React } from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
}
/** Meridian Radio — always used in a group of 2+ with a shared group label; never alone. */
export declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
