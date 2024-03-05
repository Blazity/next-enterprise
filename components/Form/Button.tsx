/**
 * Button component that supports primary and secondary variants, as well as size customization.
 * Utilizes 'class-variance-authority' for managing class variants and 'tailwind-merge' for class merging.
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/** 
 * Configure base and variant classes using 'class-variance-authority'
  * Variants:
  * - 'primary': Blue background with white text, changes on hover.
  * - 'secondary': Transparent background with amber border and text, changes on hover.
  * Sizes:
  * - 'sm': Small size button.
  * - 'lg': Large size button (default).
*/

const button = cva(
  "flex items-center justify-center rounded-md py-3 px-9 text-center text-sm font-bold transition-all md:min-w-[240px]",
  {
    variants: {
      variant: {
        primary: ["bg-blue-950 text-white", "hover:enabled:bg-blue-700"],
        secondary: ["border-2 border-amber-500 text-amber-500", "hover:enabled:bg-amber-500 hover:enabled:text-white"],
      },
      size: {
        sm: ["py-2 px-4", "text-xs"],
        lg: ["py-3 px-9", "text-sm"], 
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);

// ButtonProps extends standard button attributes with variant and size customization options.
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

// Button component: Renders a button with customizable variants, sizes, and additional passed props.
export const Button: React.FC<ButtonProps> = ({ className, variant, size, ...props }) => {
  return (
    <button className={twMerge(button({ variant, size }), className)} {...props}>
      {props.children}
    </button>
  );
};
