import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-600/20 hover:from-violet-400 hover:to-violet-600 hover:shadow-violet-500/30 active:from-violet-600 active:to-violet-800",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-700 text-white shadow-lg shadow-red-600/20 hover:from-red-400 hover:to-red-600",
        outline:
          "border border-white/[0.18] bg-white/[0.09] text-zinc-200 hover:bg-white/[0.10] hover:border-white/[0.18] hover:text-white",
        secondary:
          "bg-white/[0.07] text-zinc-100 hover:bg-white/[0.12] border border-white/[0.18]",
        ghost: "text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-100",
        link: "text-violet-400 underline-offset-4 hover:underline hover:text-violet-300",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3.5 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
