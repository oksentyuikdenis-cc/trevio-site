import { default as React } from 'react';

export type BadgeTone = 'positive' | 'negative' | 'caution' | 'info' | 'neutral' | 'count';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Semantic tone. `count` renders as a solid accent pill for attention-worthy counts. */
    tone?: BadgeTone;
    /** Renders as a full pill instead of the default rounded-rect. */
    pill?: boolean;
    children?: React.ReactNode;
}
/**
 * Meridian Badge — status, sentiment, category, and count labels.
 * Sentiment badges use subtle semantic fills, never solid color, to stay quiet in dense tables.
 */
export declare const Badge: React.FC<BadgeProps>;
