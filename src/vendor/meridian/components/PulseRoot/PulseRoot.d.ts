import { default as React } from 'react';

export interface PulseRootProps {
    children?: React.ReactNode;
}
/**
 * Meridian Root — wraps any subtree using these components. Sets the dark canvas
 * background, base typography, and box-sizing reset that every component assumes.
 * Required: components render unstyled (or with unreadable light-on-nothing text)
 * without it.
 */
export declare const PulseRoot: React.FC<PulseRootProps>;
