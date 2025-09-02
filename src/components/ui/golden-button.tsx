import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const goldenButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GoldenButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof goldenButtonVariants> {
  showArrow?: boolean;
}

const GoldenButton = React.forwardRef<HTMLButtonElement, GoldenButtonProps>(
  ({ className, size, showArrow, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "bg-yellow-500 hover:bg-yellow-600 text-black",
          goldenButtonVariants({ size, className })
        )}
        ref={ref}
        {...props}
      >
        {children}
        {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
      </button>
    );
  }
);
GoldenButton.displayName = "GoldenButton";

export { GoldenButton, goldenButtonVariants };
