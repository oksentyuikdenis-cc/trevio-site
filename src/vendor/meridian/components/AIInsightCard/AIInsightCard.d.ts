import { default as React } from 'react';

/** Small marker that identifies AI-generated content. Used identically across every AI-attributed surface. */
export declare const AIBadge: React.FC<{
    label?: string;
}>;
export interface EvidenceChip {
    name: string;
    quote: string;
    source: string;
}
export interface InsightImpactStat {
    value: string;
    label: string;
}
export interface AIInsightCardProps {
    title: string;
    /** Sample size and time window — required, never optional. */
    scope: string;
    /** 2–4 sentence synthesis, rendered in the reading typeface. */
    summary: string;
    impact?: InsightImpactStat[];
    /** At least 3 pieces of evidence should be visible without a click. */
    evidence?: EvidenceChip[];
    onAddToRoadmap?: () => void;
    onMarkDuplicate?: () => void;
}
/**
 * Meridian AI Insight Card — the system's most important component. Never ships without
 * a populated evidence trail: every AI claim must be traceable to source conversations.
 */
export declare const AIInsightCard: React.FC<AIInsightCardProps>;
