import { Button } from '@nextui-org/react'
import { BodyB3, TitleT2 } from './Texts'
import { TheNestIcon } from './Icons.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { SwapContext } from '../contexts/SwapContext.ts'
import { useIsSm } from '../hooks/useMedia.ts'

export default function Menu() {
  const navigate = useNavigate()
  const location = useLocation()
  const { swapLocation } = useContext(SwapContext)
  const isActiveSwap = location.pathname.startsWith('/swap')
  const isActiveTheNest = location.pathname.startsWith('/the-nest')
  const isSm = useIsSm()
  return (
    <div className="flex items-center gap-4 md:justify-center md:gap-2 sm:gap-0">
      <Button
        variant="light"
        className={
          's min-w-0 rounded px-4 sm:h-fit sm:px-2 sm:py-2' + (isActiveSwap ? ' border-1 border-primaryHover' : '')
        }
        onPress={() => {
          navigate(swapLocation, { replace: true })
        }}
      >
        <TitleT2 className={'sm:text-[10px] sm:leading-3' + (!isActiveSwap ? ' text-disable' : ' text-primaryHover')}>
          Swap
        </TitleT2>
      </Button>
      <Button
        variant="light"
        className={
          'gap-1 rounded px-4 sm:h-fit  sm:gap-0.5 sm:px-1 sm:py-2' +
          (isActiveTheNest ? ' border-1 border-primaryHover' : '')
        }
        onPress={() => navigate('/the-nest')}
      >
        <TitleT2
          className={
            'mr-3 sm:mr-1 sm:text-[10px] sm:leading-3' + (!isActiveTheNest ? ' text-disable' : ' text-primaryHover')
          }
        >
          The Nest
        </TitleT2>
        <TheNestIcon size={isSm ? 12 : 25} />
      </Button>
      <Button variant="light" className="gap-1 rounded px-4 sm:h-fit sm:gap-0.5 sm:px-1 sm:py-2" isDisabled>
        <TitleT2 className="leading-3 text-disable sm:text-[10px]">Bridge</TitleT2>
        <BodyB3 className="rounded border-1 border-primary px-1 align-bottom text-primary sm:text-[7px]">soon</BodyB3>
      </Button>
    </div>
  )
}
