import { default as React } from 'react';

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg';
    footer?: React.ReactNode;
    children?: React.ReactNode;
}
/**
 * Meridian Modal — for focused, blocking tasks completable in ~2 steps or less.
 * Longer or context-preserving flows should use a Drawer instead.
 */
export declare const Modal: React.FC<ModalProps>;
