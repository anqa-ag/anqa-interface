import { Button, Image, Link, Spacer } from "@nextui-org/react"
import { useState } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import { ArrowFilledDownIcon, SettingIcon, SwapIcon } from "./components/Icons"
import { BodyB2, BodyB3, TitleT2 } from "./components/Texts"
import { Chart1, Chart2 } from "./components/Chart"
import { NumberInput, NumberInput2 } from "./components/NumberInput"

export default function App() {
  const [isSwapping, setIsSwapping] = useState(false)
  const onSwap = () => {
    setIsSwapping(true)
    setTimeout(() => {
      setIsSwapping(false)
    }, 1000)
  }

  const [isMoreInfo, setIsMoreInfo] = useState(true)
  const onToggleMoreInfo = () => {
    setIsMoreInfo((prev) => !prev)
  }

  return (
    <main className="bg-background text-foreground dark">
      <div className="h-lvh w-lvw overflow-hidden">
        <div className="absolute h-lvh w-lvw bg-[url('/images/background.svg')] bg-cover bg-bottom bg-no-repeat opacity-40" />
        <div className="isolate">
          {/*
          ###############################################################################
          #
          #                                                                        HEADER
          #
          ###############################################################################
          */}
          <header className="flex h-[84px] content-center items-center justify-between px-[60px]">
            <div className="flex-1">
              <Button isIconOnly variant="light" className="h-[48px] w-[48px]">
                <Image width={60} src="/favicon.png" />
              </Button>
            </div>
            <div className="flex gap-4">
              <Button variant="light" className="rounded border-1 border-primaryHover px-4">
                <TitleT2 className="text-primaryHover">Trade</TitleT2>
              </Button>
              <Button variant="light" className="gap-1 rounded px-4" disabled>
                <TitleT2 className="text-disable">Bridge</TitleT2>
                <BodyB3 className="rounded border-1 border-primary px-1 align-bottom text-primary">soon</BodyB3>
              </Button>
              <Button variant="light" className="gap-1 rounded px-4" disabled>
                <TitleT2 className="text-disable">Cross-chain</TitleT2>
                <BodyB3 className="rounded border-1 border-primary px-1 align-bottom text-primary">soon</BodyB3>
              </Button>
            </div>
            <div className="flex-1 text-end">
              <Button color="primary" className="rounded">
                <TitleT2>Connect Wallet</TitleT2>
              </Button>
            </div>
          </header>
          {/*
          ###############################################################################
          #
          #                                                                          MAIN
          #
          ###############################################################################
          */}
          <div className="mt-[60px] w-full">
            <div className="mx-auto flex max-w-[420px] flex-col">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Button
                    className="h-[36px] min-w-min gap-1 rounded bg-primaryHover p-2"
                    endContent={<SwapIcon size={16} />}
                  >
                    <TitleT2 className="text-black">Swap</TitleT2>
                  </Button>
                </div>
                <Button isIconOnly variant="light" className="h-[36px] w-[36px] min-w-min">
                  <SettingIcon size={36} />
                </Button>
              </div>

              <Spacer y={4} />

              <div className="relative flex flex-col gap-1">
                <NumberInput />
                <div className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2">
                  <Button
                    isIconOnly
                    className="rounded-full border-2 border-background bg-buttonDisabled data-[hover]:border-buttonSecondary"
                  >
                    <SwapIcon size={24} color="#FFFFFF" />
                  </Button>
                </div>
                <NumberInput2 />
              </div>

              <Spacer y={3} />

              <div className="anqa-hover-primary-all flex cursor-pointer items-center gap-3" tabIndex={0}>
                <BodyB2 className="rounded border-1 border-primary p-2 text-primary">2 splits & 3 hops</BodyB2>
                <BodyB3 className="text-buttonSecondary">via Pancakeswap, Cellana, Liquidswap</BodyB3>
                <ArrowFilledDownIcon size={24} className="ml-auto -rotate-90" color="#9AA0A6" />
              </div>

              <Spacer y={3} />

              <Button color="primary" className="h-[52px] rounded" isLoading={isSwapping} onClick={onSwap}>
                <TitleT2>Swap</TitleT2>
              </Button>

              <Spacer y={4} />

              <div className="flex flex-col gap-2 rounded-lg border-1 border-buttonSecondary p-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <BodyB2>1 USDC = 0.11650797 APT</BodyB2>
                    <CountdownCircleTimer
                      isPlaying
                      duration={10}
                      colors={["#0079BF", "#0079BF"]}
                      colorsTime={[0, 0]}
                      onComplete={() => ({ shouldRepeat: true, delay: 0 })}
                      isSmoothColorTransition={false}
                      trailColor="#101010"
                      size={16}
                      strokeWidth={2}
                    >
                      {({ remainingTime }) => <div className="text-[8px] text-buttonSecondary">{remainingTime}</div>}
                    </CountdownCircleTimer>
                  </div>
                  <div
                    className="anqa-hover-white-all flex cursor-pointer select-none items-center gap-1"
                    tabIndex={0}
                    onClick={onToggleMoreInfo}
                  >
                    <BodyB2 className=" text-buttonSecondary">{isMoreInfo ? "Less Info" : "More info"}</BodyB2>
                    <ArrowFilledDownIcon
                      size={24}
                      className={`ml-auto ${isMoreInfo ? "rotate-180" : ""}`}
                      color="#9AA0A6"
                    />
                  </div>
                </div>
                {isMoreInfo && (
                  <>
                    <div className="flex justify-between">
                      <BodyB2 className="text-buttonSecondary">Price Impact</BodyB2>
                      <BodyB2>~0.2574%</BodyB2>
                    </div>
                    <div className="flex justify-between">
                      <BodyB2 className="text-buttonSecondary">Minimum Receive</BodyB2>
                      <BodyB2>1.157999822 APT</BodyB2>
                    </div>
                    <div className="flex justify-between">
                      <BodyB2 className="text-buttonSecondary">Max Transaction Fee</BodyB2>
                      <BodyB2>0.000305 APT</BodyB2>
                    </div>
                  </>
                )}
              </div>

              <Spacer y={4} />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Image
                      width={20}
                      height={20}
                      className="min-h-[20px] min-w-[20px]"
                      src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
                    />
                    <TitleT2 className="whitespace-nowrap">USDC</TitleT2>
                  </div>
                  <Link isBlock showAnchorIcon href="#" color="primary" className="p-0 text-buttonSecondary" size="sm">
                    <BodyB3 className="text-buttonSecondary">0x48b...abb612</BodyB3>
                  </Link>
                </div>
                <div className="flex w-[200px] flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <BodyB2>$1</BodyB2>
                    <BodyB2 className="text-buttonRed">-0.18%</BodyB2>
                  </div>
                  <Chart1 />
                </div>
              </div>

              <Spacer y={4} />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Image
                      width={20}
                      height={20}
                      className="min-h-[20px] min-w-[20px]"
                      src="https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png"
                    />
                    <TitleT2 className="whitespace-nowrap">APT</TitleT2>
                  </div>
                  <Link isBlock showAnchorIcon href="#" color="primary" className="p-0 text-buttonSecondary" size="sm">
                    <BodyB3 className="text-buttonSecondary">0x97f...3bf84c</BodyB3>
                  </Link>
                </div>
                <div className="flex w-[200px] flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <BodyB2>$144.5</BodyB2>
                    <BodyB2 className="text-buttonGreen">+9.88%</BodyB2>
                  </div>
                  <Chart2 />
                </div>
              </div>
            </div>
          </div>

          {/*
          ###############################################################################
          #
          #                                                                        FOOTER
          #
          ###############################################################################
          */}
        </div>
      </div>
    </main>
  )
}
