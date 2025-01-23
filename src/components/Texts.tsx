import { forwardRef } from 'react'

interface TextProps {
  className?: string
  [x: string]: any
}

export const Headline2 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-[36px] font-semibold leading-[42.23px] sm:text-[20px] sm:leading-[23.46px] ${className ?? ''}`}
    {...props}
  />
))
Headline2.displayName = 'Headline2'

export const TitleT1 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-xl font-medium ${className ?? ''}`} {...props} />
))
TitleT1.displayName = 'TitleT1'

export const TitleT2 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-base font-medium ${className ?? ''}`} {...props} />
))
TitleT2.displayName = 'TitleT2'

export const TitleT4 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-[13px] font-medium ${className ?? ''}`} {...props} />
))
TitleT4.displayName = 'TitleT4'

export const TitleT5 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-xs font-medium ${className ?? ''}`} {...props} />
))
TitleT5.displayName = 'TitleT5'

export const BodyB1 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-base font-normal ${className ?? ''}`} {...props} />
))
BodyB1.displayName = 'BodyB1'

export const BodyB2 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-sm font-normal ${className ?? ''}`} {...props} />
))
BodyB2.displayName = 'BodyB2'

export const BodyB3 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-xs font-normal ${className ?? ''}`} {...props} />
))
BodyB3.displayName = 'BodyB3'

export const BodyB4 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-[12px] font-normal leading-[14px] ${className ?? ''}`} {...props} />
))
BodyB4.displayName = 'BodyB4'

export const Subtitle3 = forwardRef<HTMLDivElement, TextProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-[14px] font-medium leading-[16.42px] sm:text-[12px] sm:leading-[14px] ${className ?? ''}`}
    {...props}
  />
))
Subtitle3.displayName = 'Subtitle3'

