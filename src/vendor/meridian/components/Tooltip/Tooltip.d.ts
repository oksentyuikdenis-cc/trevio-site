import { default as React } from 'react';

export interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactElement;
}
/** Meridian Tooltip — short, single-purpose text only. Use Popover for interactive or multi-sentence content. */
export declare const Tooltip: React.FC<TooltipProps>;
