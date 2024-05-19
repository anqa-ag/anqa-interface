import { forwardRef } from "react"

interface TextProps {
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

export const TitleT1 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-xl font-medium ${className ?? ""}`} {...props} />
))
TitleT1.displayName = "TitleT1"

export const TitleT2 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-base font-medium ${className ?? ""}`} {...props} />
))
TitleT2.displayName = "TitleT2"

export const BodyB2 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-sm font-normal ${className ?? ""}`} {...props} />
))
BodyB2.displayName = "BodyB2"

export const BodyB3 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-xs font-normal ${className ?? ""}`} {...props} />
))
BodyB3.displayName = "BodyB3"
