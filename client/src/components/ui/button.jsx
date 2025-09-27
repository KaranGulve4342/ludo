import React from "react"
import { cn } from "../../lib/utils.js"

const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

const variants = {
  default: "bg-primary text-primary-foreground hover:opacity-95",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-95",
  outline: "border border-border bg-transparent hover:bg-secondary",
  ghost: "hover:bg-muted/60",
}

export const Button = React.forwardRef(function Button(
  { className, variant = "default", asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? "span" : "button"
  return <Comp ref={ref} className={cn(base, variants[variant], className)} {...props} />
})
