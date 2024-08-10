import AppLayout from './AppLayout.tsx'
import { Button, Image } from '@nextui-org/react'
import { TitleT2 } from './components/Texts.tsx'
import { TrophyIcon, YourNestIcon } from './components/Icons.tsx'
import VolumeBadges from './components/VolumeBadges.tsx'
import HowToEarnExp from './components/HowToEarnExp.tsx'
import YourTotalExp from './components/YourTotalExp.tsx'
import usePoint from './hooks/usePoint.ts'
import useAnqaWallet from './hooks/useAnqaWallet.ts'
import { useIsSm } from './hooks/useMedia.ts'
import TheNestMobileBanner from './components/TheNestMobileBanner.tsx'
import { useState } from 'react'

export default function TheNest() {
  const { account } = useAnqaWallet()
  const { totalPoint } = usePoint(account?.address)
  const isSm = useIsSm()

  const [activeTab, setActiveTab] = useState(0)
  const tabMyNest = activeTab === 0
  const tabLeaderboard = activeTab === 1

  return (
    <AppLayout>
      <div className="flex h-fit w-full items-center justify-center gap-4 bg-[#004DFF1A] md:gap-2">
        <Button
          variant="light"
          disableAnimation
          disableRipple
          className={'sm:h-fit sm:px-2 sm:py-2' + (tabMyNest ? ' ' + 'border-b-1 border-b-primaryHover' : '')}
          radius="none"
          onPress={() => setActiveTab(0)}
        >
          <TitleT2
            className={'sm:h-fit sm:text-[10px]' + (tabMyNest ? ' ' + 'text-primaryHover' : ' ' + 'text-disable')}
          >
            My Nest
          </TitleT2>
          <YourNestIcon size={isSm ? 10 : 12} color={tabMyNest ? "#0CA0EB": "#282A2D"}/>
        </Button>
        <Button
          variant="light"
          disableAnimation
          disableRipple
          radius="none"
          className={'sm:h-fit sm:px-2 sm:py-2' + (tabLeaderboard ? ' ' + 'border-b-1 border-b-primaryHover' : '')}
          onPress={() => setActiveTab(1)}
        >
          <TitleT2
            className={'sm:h-fit sm:text-[10px]' + (tabLeaderboard ? ' ' + 'text-primaryHover' : ' ' + 'text-disable')}
          >
            Leaderboard
          </TitleT2>
          <TrophyIcon size={18} color={tabLeaderboard ? '#0CA0EB' : '#282A2D'} />
        </Button>
      </div>
      {activeTab === 0 && (
        <>
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
        </>
      )}
      {activeTab === 1 && <>ok</>}
    </AppLayout>
  )
}
