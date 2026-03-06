import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-none border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-orange-800 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#1A1A1A] text-white border-[#1A1A1A] [a&]:hover:bg-orange-950",
        secondary:
          "bg-[#FAF7F2] text-gray-500 border border-gray-200 [a&]:hover:bg-[#FAF7F2]",
        destructive:
          "bg-destructive text-white border-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-gray-200 text-gray-500 bg-[#FAF7F2] [a&]:hover:bg-[#1A1A1A] [a&]:hover:text-white",
        ghost: "[a&]:hover:bg-[#FAF7F2] [a&]:hover:text-[#1A1A1A]",
        link: "text-[#1A1A1A] underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
