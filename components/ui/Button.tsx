import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-sky-500 text-white shadow-sm hover:bg-sky-600 font-semibold",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600 font-semibold",
        outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm",
        ghost: "hover:bg-slate-100 text-slate-600",
        link: "text-sky-600 hover:text-sky-800 font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// FIX: Changed interface to a type alias to fix an issue where VariantProps were not being correctly inferred.
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }