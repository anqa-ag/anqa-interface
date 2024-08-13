import AppLayout from '../AppLayout.tsx'
import { Button, Image, Spacer } from '@nextui-org/react'
import { TitleT1, TitleT2 } from '../components/Texts.tsx'
import { TrophyIcon, YourNestIcon } from '../components/Icons.tsx'
import VolumeBadges from '../components/VolumeBadges.tsx'
import HowToEarnExp from '../components/HowToEarnExp.tsx'
import YourTotalExp from '../components/YourTotalExp.tsx'
import usePoint from '../hooks/usePoint.ts'
import useAnqaWallet from '../hooks/useAnqaWallet.ts'
import { useIsSm } from '../hooks/useMedia.ts'
import TheNestMobileBanner from '../components/TheNestMobileBanner.tsx'
import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function TheNest() {
  const { account } = useAnqaWallet()
  const { totalPoint } = usePoint(account?.address)
  const isSm = useIsSm()

  const [activeTab, setActiveTab] = useState(1)
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
          <YourNestIcon size={isSm ? 10 : 12} color={tabMyNest ? '#0CA0EB' : '#282A2D'} />
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

      {/********************* My Nest *********************/}

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

      {/********************* Leaderboard *********************/}

      {activeTab === 1 && (
        <>
          <Spacer y={4} />
          <img src="/images/thenest_leaderboard_bg.svg" width="100%" alt="" />
          <Spacer y={4} />
          <div className="mx-auto flex w-full max-w-[870px] flex-col bg-[red]">
            <div className="flex w-full bg-[red]">
              <div className="shrink-0 grow-[2] basis-0 bg-[green] px-6 py-4">
                <TitleT1 className="font-clashDisplayMedium">Your Total EXP</TitleT1>
                <div className="flex h-fit min-h-fit w-fit min-w-[150px] items-center justify-center gap-2.5 rounded-3xl bg-[#2B313D] px-3 py-2.5">
                  <Image width={isSm ? 22 : 30} src={'/images/coin.png'} />
                  <div className="font-clashDisplayBold text-4xl xl:text-2xl sm:text-xl">
                    {/*{numberWithCommas(totalPoint.toSignificant(6), true, 0)}*/}
                    25,000
                  </div>
                </div>
              </div>
              <div className="shrink-0 grow basis-0 bg-[orange] p-4">
                <TitleT1 className="font-clashDisplayMedium">Your Rank</TitleT1>
                <div className="flex h-fit min-h-fit w-fit min-w-[150px] items-center justify-center gap-2.5 rounded-3xl bg-[#2B313D] px-3 py-2.5">
                  <YourNestIcon size={isSm ? 16 : 22} color="#FFBE01" />
                  <div className="font-clashDisplayBold text-4xl xl:text-2xl sm:text-xl">25,000</div>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-[red]">
              <div className="flex shrink-0 grow-[2] basis-0 items-center justify-between bg-[#2667FE] px-6 py-2">
                <TitleT1 className="font-clashDisplayBold">Swap Now</TitleT1>
                <Icon icon="majesticons:arrow-right" width={24}/>
              </div>
              <div className="shrink-0 grow basis-0 bg-[cyan] px-4" />
            </div>
          </div>
        </>
      )}
    </AppLayout>
  )
}
