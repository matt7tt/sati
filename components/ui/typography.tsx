import { cn } from "@/lib/utils"
import React from "react"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: "xl" | "lg" | "md" | "sm" | "xs"
}

export function Heading({
  className,
  as: Tag = "h2",
  size = "lg",
  children,
  ...props
}: HeadingProps) {
  const sizeClasses = {
    xl: "text-5xl md:text-6xl font-medium tracking-tight",
    lg: "text-4xl font-medium tracking-tight",
    md: "text-3xl font-medium",
    sm: "text-2xl font-medium",
    xs: "text-xl font-medium",
  }

  return (
    <Tag
      className={cn(
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "lg" | "md" | "sm" | "xs"
  muted?: boolean
}

export function Text({
  className,
  size = "md",
  muted = false,
  children,
  ...props
}: TextProps) {
  const sizeClasses = {
    lg: "text-xl",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs",
  }

  return (
    <p
      className={cn(
        sizeClasses[size],
        muted && "text-subtext",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
} 