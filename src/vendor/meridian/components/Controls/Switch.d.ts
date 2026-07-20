import { default as React } from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: React.ReactNode;
}
/**
 * Meridian Switch — for settings that take effect immediately, with no separate save step.
 * Use Checkbox instead when the change requires an explicit save action.
 */
export declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;
