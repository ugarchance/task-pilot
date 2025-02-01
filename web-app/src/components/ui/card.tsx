import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { HTMLAttributes } from "react"

const cardVariants = cva(
  "rounded-lg shadow-lg bg-white transition-all",
  {
    variants: {
      variant: {
        default: "border border-gray-200",
        elevated: "shadow-xl"
      },
      padding: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "md"
    }
  }
)

interface CardProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = ({ className, variant, padding, ...props }: CardProps) => {
  return (
    <div 
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
}

export { Card } 