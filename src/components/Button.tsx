import { Button, ButtonProps } from '@nextui-org/react'

// Change this variable name will no longer get tailwind intellisense
const className = {
  primary:
    'bg-primary ' +
    'text-baseBlack ' +
    'data-[hover]:bg-primaryHover ' +
    'data-[hover]:text-baseBlack ' +
    'data-[hover]:opacity-1 ' +
    'data-[disabled]:opacity-50',
  secondary:
    'bg-secondary ' +
    'text-primary ' +
    'data-[hover]:bg-secondary ' +
    'data-[hover]:opacity-1 ' +
    'data-[disabled]:opacity-50',
  error:
    'bg-error ' +
    'text-white ' +
    'data-[hover]:bg-errorHover ' +
    'data-[hover]:text-white ' +
    'data-[hover]:opacity-1 ' +
    'data-[disabled]:opacity-50',
}

interface WrapperButtonProps extends ButtonProps {
  v: keyof typeof className
}

export function ButtonBase(props: WrapperButtonProps) {
  return <Button {...props} className={className[props.v] + ' ' + props.className} disableAnimation />
}
