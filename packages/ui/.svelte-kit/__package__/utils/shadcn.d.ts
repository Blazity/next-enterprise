import { type ClassValue } from 'clsx';
export declare function cn(...inputs: ClassValue[]): string;
export type WithoutChild<T> = T extends {
    child?: any;
} ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends {
    children?: any;
} ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
    ref?: U | null;
};
