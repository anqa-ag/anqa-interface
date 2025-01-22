import { Icon } from '@iconify/react/dist/iconify.js'
import { Button } from '@nextui-org/react'
import { ReactNode, useCallback, useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

export default function Copy({ value, children, size = 16 }: { children?: ReactNode; value: string; size?: number }) {
  const [, copy] = useCopyToClipboard()
  const [isCopying, setIsCopying] = useState(false)
  const onCopy = useCallback(
    async (id: string) => {
      try {
        setIsCopying(true)
        await copy(id)
        await new Promise((resolve) => setTimeout(resolve, 500))
      } finally {
        setIsCopying(false)
      }
    },
    [copy],
  )

  return (
    <Button
      variant="light"
      className="h-fit w-fit min-w-fit gap-1 self-center rounded-none p-0 font-normal data-[hover]:bg-transparent"
      onPress={() => onCopy(value)}
      disableAnimation
      disableRipple
    >
      <>
        {children}
        {isCopying ? (
          <Icon icon="material-symbols:check" fontSize={size} className="text-baseGrey" />
        ) : (
          <Icon icon="ph:copy" fontSize={size} className="text-baseGrey" />
        )}
      </>
    </Button>
  )
}
