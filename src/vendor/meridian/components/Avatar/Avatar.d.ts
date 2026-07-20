import { default as React } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Photo URL. Falls back to initials when omitted or when the image fails to load. */
    src?: string;
    /** Full name used to derive fallback initials and the accessible label. */
    name: string;
    size?: AvatarSize;
}
/**
 * Meridian Avatar — photographic when available, deterministic initials otherwise.
 * Never uses the accent color as a fallback background — initials pull from the neutral scale.
 */
export declare const Avatar: React.FC<AvatarProps>;
export interface AvatarStackProps {
    /** People to display, most recent first. */
    people: {
        name: string;
        src?: string;
    }[];
    size?: AvatarSize;
    /** Maximum avatars shown before collapsing into a "+N" indicator. */
    max?: number;
}
export declare const AvatarStack: React.FC<AvatarStackProps>;
