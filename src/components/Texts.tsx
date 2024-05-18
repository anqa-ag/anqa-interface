/* eslint-disable @typescript-eslint/no-explicit-any */

interface TextProps {
  className?: string
  [x: string]: any
}

export const TitleT1 = ({ className, ...props }: TextProps) => (
  <div className={`text-xl font-medium ${className ?? ""}`} {...props} />
)

export const TitleT2 = ({ className, ...props }: TextProps) => (
  <div className={`text-base font-medium ${className ?? ""}`} {...props} />
)

export const BodyB2 = ({ className, ...props }: TextProps) => (
  <div className={`text-sm font-normal ${className ?? ""}`} {...props} />
)

export const BodyB3 = ({ className, ...props }: TextProps) => (
  <div className={`text-xs font-normal ${className ?? ""}`} {...props} />
)
