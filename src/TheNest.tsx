import AppLayout from './AppLayout.tsx'
import { Button, Image } from '@nextui-org/react'
import { BodyB3, TitleT2 } from './components/Texts.tsx'
import { YourNestIcon } from './components/Icons.tsx'
import VolumeBadges from './components/VolumeBadges.tsx'
import HowToEarnExp from './components/HowToEarnExp.tsx'
import YourTotalExp from './components/YourTotalExp.tsx'
import usePoint from './hooks/usePoint.ts'
import useAnqaWallet from './hooks/useAnqaWallet.ts'
import { useIsSm } from './hooks/useMedia.ts'
import TheNestMobileBanner from './components/TheNestMobileBanner.tsx'

export default function TheNest() {
  const { account } = useAnqaWallet()
  const { totalPoint } = usePoint(account?.address)
  const isSm = useIsSm()

  return (
    <AppLayout>
      <div className="flex h-fit w-full items-center justify-center gap-4 bg-[#004DFF1A] md:gap-2">
        <Button variant="light" className="border-b-1 border-b-primaryHover sm:h-fit sm:px-2 sm:py-2" radius="none">
          <TitleT2 className="text-primaryHover sm:h-fit sm:text-[10px] sm:leading-3">My Nest</TitleT2>
          <YourNestIcon size={isSm ? 10 : 12} />
        </Button>
        <Button
          variant="light"
          isDisabled
          disableAnimation
          disableRipple
          radius="none"
          className="sm:h-fit sm:px-2 sm:py-2"
        >
          <TitleT2 className="leading-3 text-disable sm:h-fit sm:text-[10px]">Leaderboard</TitleT2>
          <BodyB3 className="rounded border-1 border-primary px-1 align-bottom text-primary sm:text-[7px]">soon</BodyB3>
        </Button>
      </div>
      {isSm ? (
        <div className="mt-5 flex flex-col items-center gap-5">
          <TheNestMobileBanner />
          <YourTotalExp totalExp={totalPoint} />
          <VolumeBadges totalExp={totalPoint} />
        </div>
      ) : (
        <div className="flex items-stretch justify-center gap-9 px-[60px] pt-4 xl:gap-6 xl:px-[40px]">
          <div className="flex flex-col items-stretch  gap-5">
            <div className="relative flex items-end justify-between">
              <div className="relative text-white">
                <Image width={683} src={'/images/character.png'} className="static" />
                <div className="absolute left-8 top-16 xl:left-4 xl:top-10">
                  <div className="mb-1.5 font-clashDisplayBold text-5xl xl:text-3xl">Season I</div>
                  <div className="rounded-md bg-[#2667FE] px-2 py-1 font-clashDisplay text-xs font-medium">
                    00:00 UTC July 15 - 2024 - 00:00 UTC October 1 - 2024
                  </div>
                </div>
              </div>
              <HowToEarnExp />
            </div>
            <VolumeBadges totalExp={totalPoint} />
          </div>
          <YourTotalExp totalExp={totalPoint} />
        </div>
      )}
    </AppLayout>
  )
}
