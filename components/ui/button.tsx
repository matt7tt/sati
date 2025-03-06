"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-text border border-border hover:bg-background",
        primary: "bg-[#C27C60] text-white border-none hover:bg-[#AE6F56]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-border hover:bg-background hover:text-text",
        secondary: "bg-secondary text-text hover:bg-secondary/80",
        ghost: "hover:bg-background hover:text-text",
        link: "underline-offset-4 hover:underline text-accent",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        xs: "h-8 px-2 text-xs rounded-md",
        sm: "h-9 px-3 text-sm rounded-md",
        lg: "h-11 px-6 text-base rounded-md",
        xl: "h-12 px-8 text-base rounded-md",
        icon: "h-10 w-10",
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

