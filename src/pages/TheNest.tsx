import AppLayout from '../AppLayout.tsx'
import { Button, Image, Pagination, Spacer } from '@nextui-org/react'
import { TitleT1, TitleT2 } from '../components/Texts.tsx'
import { TrophyIcon, YourNestIcon } from '../components/Icons.tsx'
import VolumeBadges from '../components/VolumeBadges.tsx'
import HowToEarnExp from '../components/HowToEarnExp.tsx'
import YourTotalExp from '../components/YourTotalExp.tsx'
import useAnqaWallet from '../hooks/useAnqaWallet.ts'
import { useIsSm } from '../hooks/useMedia.ts'
import TheNestMobileBanner from '../components/TheNestMobileBanner.tsx'
import { useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { mulpowToFraction, numberWithCommas } from '../utils/number.ts'
import { Fraction } from '../utils/fraction.ts'
import useLeaderboard from '../hooks/useLeaderboard.ts'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

export default function TheNest() {
  const navigate = useNavigate()

  const { account } = useAnqaWallet()
  const isSm = useIsSm()

  const [activeTab, setActiveTab] = useState(0)
  const tabMyNest = activeTab === 0
  const tabLeaderboard = activeTab === 1

  const [page, setPage] = useState(1)
  const { data } = useLeaderboard(page, account?.address)
  const { leaderboard, totalWallets, userPoint: _userPoint, userRank } = data?.data || {}
  const totalPage = totalWallets ? Math.min(10, Math.ceil(totalWallets / 10)) : 1
  const userPoint = useMemo(() => (_userPoint ? mulpowToFraction(_userPoint) : new Fraction(0)), [_userPoint])

  return (
    <AppLayout>
      <Helmet>
        <title>The Nest | Anqa</title>
      </Helmet>
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
              <YourTotalExp totalExp={userPoint} />
              <VolumeBadges totalExp={userPoint} />
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
                <VolumeBadges totalExp={userPoint} />
              </div>
              <YourTotalExp totalExp={userPoint} />
            </div>
          )}
        </>
      )}

      {/********************* Leaderboard *********************/}

      {activeTab === 1 && (
        <div>
          <Spacer y={4} />
          <div className="h-[100px] w-full bg-[url(/images/thenest_leaderboard_bg.svg)] bg-center bg-no-repeat" />
          <Spacer y={4} />
          <div className="mx-auto flex w-full max-w-[870px] flex-col gap-4 px-4">
            <div
              className="w-full flex-col overflow-hidden rounded-xl border-1 border-line"
              style={{
                background:
                  'var(--Gradient, radial-gradient(224.13% 231.56% at 80.49% 128.61%, #2667FE 0%, #0041DA 9.72%, #030181 21.71%, #001343 36.96%, #000 69.59%))',
              }}
            >
              <div className="flex w-full">
                <div className="w-[65%] rounded border-r-1 border-[rgba(55,135,255,0.5)] px-6 py-4 sm:w-1/2">
                  <TitleT1 className="font-clashDisplayMedium">Your Total EXP</TitleT1>
                  <div className="flex h-fit min-h-fit w-fit min-w-[150px] items-center justify-center gap-2.5 rounded-3xl bg-[#2B313D] px-3 py-2.5">
                    <Image width={isSm ? 22 : 30} src={'/images/coin.png'} />
                    <div className="font-clashDisplayBold text-4xl xl:text-2xl sm:text-xl">
                      {account ? numberWithCommas(userPoint.toSignificant(6), true, 0) : '--'}
                    </div>
                  </div>
                </div>
                <div className="w-[35%] basis-0 p-4 sm:w-1/2">
                  <TitleT1 className="font-clashDisplayMedium">Your Rank</TitleT1>
                  <div className="flex h-fit min-h-fit w-fit min-w-[150px] items-center justify-center gap-2.5 rounded-3xl bg-[#2B313D] px-3 py-2.5">
                    <YourNestIcon size={isSm ? 16 : 22} color="#FFBE01" />
                    <div className="font-clashDisplayBold text-4xl xl:text-2xl sm:text-xl">
                      {account && userRank ? numberWithCommas(userRank.toString(), true, 0) : '--'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full">
                <Button
                  variant="light"
                  className="flex w-[65%] items-center justify-between rounded-none border-r-1 border-transparent bg-[#2667FE] px-6 py-2 data-[hover]:bg-[#2667FE] data-[hover]:opacity-90 sm:w-1/2"
                  disableAnimation
                  disableRipple
                  onPress={() => navigate(`/swap/APT-zUSDC`, { replace: false })}
                >
                  <TitleT1 className="font-clashDisplayBold">Swap Now</TitleT1>
                  <Icon icon="majesticons:arrow-right" width={24} />
                </Button>
                <div className="w-[35%] bg-[#3787FF4D] px-4 sm:w-1/2" />
              </div>
            </div>

            {/* Table leaderboard */}
            <div
              className="flex min-h-[691px] w-full flex-col gap-1.5 rounded-xl border-1 border-line px-4 py-8"
              style={{
                background:
                  'var(--Gradient, radial-gradient(224.13% 231.56% at 80.49% 128.61%, #2667FE 0%, #0041DA 9.72%, #030181 21.71%, #001343 36.96%, #000 69.59%))',
              }}
            >
              <div className="flex h-[44px] w-full items-center rounded-md bg-[#00123A] px-4">
                <TitleT2 className="w-[10%] px-4 font-clashDisplayMedium sm:px-0">Rank</TitleT2>
                <TitleT2 className="w-1/2 px-4 text-end font-clashDisplayMedium sm:px-0">Address</TitleT2>
                <TitleT2 className="w-2/5 px-4 text-end font-clashDisplayMedium sm:px-0">Total EXP</TitleT2>
              </div>
              {leaderboard
                ? leaderboard.map((item, index) => (
                    <div key={index} className="flex h-[44px] w-full items-center rounded-md bg-[#00123A] px-4">
                      <TitleT2 className="w-[10%] px-4 font-clashDisplayMedium text-buttonSecondary sm:px-0">
                        {(page - 1) * 10 + index + 1}
                      </TitleT2>
                      <TitleT2 className="w-1/2 px-4 text-end font-clashDisplayMedium text-buttonSecondary sm:px-0">
                        {item.address}
                      </TitleT2>
                      <TitleT2 className="w-2/5 px-4 text-end font-clashDisplayMedium text-buttonSecondary sm:px-0">
                        {numberWithCommas(mulpowToFraction(item.totalPoint).toSignificant(6), true, 2)}
                      </TitleT2>
                    </div>
                  ))
                : null}
              {totalPage > 1 && (
                <div className="flex h-[75px] w-full items-center justify-center rounded-md bg-[#00123A]">
                  <Pagination
                    color="primary"
                    initialPage={1}
                    page={page}
                    onChange={(page) => setPage(page)}
                    total={totalPage}
                    classNames={{ item: 'bg-transparent rounded', cursor: 'rounded' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
