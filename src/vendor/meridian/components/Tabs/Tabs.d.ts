import { default as React } from 'react';

export interface TabItem {
    value: string;
    label: string;
}
export interface TabsProps {
    items: TabItem[];
    value: string;
    onChange: (value: string) => void;
}
/**
 * Meridian Tabs — switches which content is showing; always deep-linkable to a distinct state.
 * Use SegmentedControl instead when switching only the representation of the same data.
 */
export declare const Tabs: React.FC<TabsProps>;
export interface SegmentedControlProps {
    items: TabItem[];
    value: string;
    onChange: (value: string) => void;
}
/** Meridian Segmented Control — switches the representation of the same data; never changes the route. */
export declare const SegmentedControl: React.FC<SegmentedControlProps>;
