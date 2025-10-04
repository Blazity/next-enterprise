import type { Snippet } from 'svelte';
interface ButtonProps {
    intent?: 'primary' | 'secondary';
    size?: 'sm' | 'lg';
    underline?: boolean;
    href?: string;
    children?: Snippet;
    class?: string;
}
declare const Button: import("svelte").Component<ButtonProps, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
