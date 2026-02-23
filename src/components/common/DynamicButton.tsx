"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface DynamicButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning"
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  size?: "default" | "sm" | "lg" | "icon"
  fullWidth?: boolean
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  children: React.ReactNode
  className?: string
  type?: "button" | "submit" | "reset"
  title?: string
}

export default function DynamicButton({
  variant = "default",
  loading = false,
  loadingText,
  icon,
  iconPosition = "left",
  size = "default",
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  className,
  ...props
}: DynamicButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || isLoading || disabled) return

    if (onClick) {
      try {
        setIsLoading(true)
        await onClick(e)
      } catch (error) {
        console.error("Button click error:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const isDisabled = disabled || loading || isLoading

  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white"
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white"
      default:
        return ""
    }
  }

  const buttonContent = (
    <>
      {loading || isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </>
  )

  return (
    <Button
      variant={variant === "success" || variant === "warning" ? "default" : variant}
      size={size}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        getVariantClass(),
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {buttonContent}
    </Button>
  )
}
