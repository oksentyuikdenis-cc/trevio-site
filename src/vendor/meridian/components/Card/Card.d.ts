import { default as React } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    /** Reduces internal padding for dense contexts like the Inbox. */
    compact?: boolean;
    /** Adds a hover state; the whole card becomes one click target. */
    interactive?: boolean;
    children?: React.ReactNode;
}
/**
 * Meridian Card — the base content container. Never nest a bordered card of the same
 * elevation inside another; use a divider and indentation for internal grouping instead.
 */
export declare const Card: React.FC<CardProps>;
export interface StatCardProps {
    label: string;
    value: string;
    /** Direction of the delta, if shown. Omit to render a static stat with no comparison. */
    delta?: {
        direction: 'up' | 'down';
        text: string;
        window: string;
    };
}
/** Meridian Stat Card — a single headline metric. Every delta must state its comparison window. */
export declare const StatCard: React.FC<StatCardProps>;
