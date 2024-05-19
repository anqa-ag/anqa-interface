import { Button, Image, Link, Spacer, Tooltip } from "@nextui-org/react"
import { useRef, useState } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import { Chart1, Chart2 } from "./components/Chart"
import { AnqaIcon, ArrowFilledDownIcon, SettingIcon, SwapIcon } from "./components/Icons"
import { NumberInput, NumberInput2 } from "./components/NumberInput"
import { BodyB2, BodyB3, TitleT2 } from "./components/Texts"
import { useIsSm } from "./hooks/useMedia"
import useWalletProvider, { Network } from "./hooks/useWalletProvider"
import { isDesktop } from "react-device-detect"
import useTooltip from "./hooks/useTooltip"
import { useClickAway } from "react-use"

function Menu() {
  return (
    <div className="flex items-center gap-4 md:justify-center md:gap-2">
      <Button variant="light" className="min-w-0 rounded border-1 border-primaryHover px-4">
        <TitleT2 className="text-primaryHover">Trade</TitleT2>
      </Button>
      <Button variant="light" className="gap-1 rounded px-4" disabled>
        <TitleT2 className="text-disable">Bridge</TitleT2>
        <BodyB3 className="rounded border-1 border-primary px-1 align-bottom text-primary">soon</BodyB3>
      </Button>
    </div>
  )
}

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

  const isSm = useIsSm()

  const { onConnect, isConnecting, connectedWallet, network } = useWalletProvider()
  const isMainnet = network === Network.Mainnet

  const {
    tooltipPriceImpact,
    setTooltipPriceImpact,

    tooltipMinimumReceive,
    setTooltipMinimumReceive,

    tooltipMaxTxFee,
    setTooltipMaxTxFee,
  } = useTooltip()

  const tooltipPriceImpactRef = useRef(null)
  useClickAway(tooltipPriceImpactRef, () => {
    !isDesktop && setTooltipPriceImpact(false)
  })

  const tooltipMinimumReceiveRef = useRef(null)
  useClickAway(tooltipMinimumReceiveRef, () => {
    !isDesktop && setTooltipMinimumReceive(false)
  })

  const tooltipMaxTxFeeRef = useRef(null)
  useClickAway(tooltipMaxTxFeeRef, () => {
    !isDesktop && setTooltipMaxTxFee(false)
  })

  return (
    <main className="h-full bg-background text-foreground dark">
      <div className="h-full w-lvw">
        <div className="fixed top-0 h-full w-lvw bg-[url('/images/background.svg')] bg-cover bg-bottom bg-no-repeat opacity-40" />
        <div className="isolate min-h-lvh">
          {/*
          ###############################################################################
          #
          #                                                                        HEADER
          #
          ###############################################################################
          */}
          <header className="flex h-[84px] items-center justify-between px-[60px] lg:px-[30px] md:justify-center md:px-[16px]">
            <div className="flex flex-1">
              <Button isIconOnly variant="light" className="h-[40px] w-[40px]">
                <AnqaIcon size={40} />
              </Button>
            </div>
            {isSm ? (
              <Menu />
            ) : (
              <>
                <Menu />
                <div className="flex-1 text-end">
                  <Button
                    color="primary"
                    className={
                      "rounded" +
                      " " +
                      (connectedWallet
                        ? "border-buttonSecondary bg-background text-buttonSecondary"
                        : "border-primary bg-primary text-white")
                    }
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={onConnect}
                    isLoading={isConnecting}
                    variant={connectedWallet ? "bordered" : "solid"}
                    disabled={!!connectedWallet}
                  >
                    {connectedWallet && isMainnet && (
                      <Image
                        width={20}
                        src="https://docs.martianwallet.xyz/~gitbook/image?url=https%3A%2F%2F3606291109-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FXillBNDwQOz0oPJ4OtRH%252Ficon%252FwxJ2nQfvB7av7RD11Zff%252FGroup%252048096217.png%3Falt%3Dmedia%26token%3D58ddee77-237e-4561-b712-1a2f0170c601&width=32&dpr=1&quality=100&sign=e2a4694961775d617093cded8bc23ca571cd6b8981292cda0ebaf6f2901e329d"
                      />
                    )}
                    {connectedWallet ? (
                      isMainnet ? (
                        <TitleT2>{connectedWallet.slice(0, 4) + "..." + connectedWallet.slice(-4)}</TitleT2>
                      ) : (
                        <TitleT2>Wrong Network ({network})</TitleT2>
                      )
                    ) : (
                      <TitleT2>Connect Wallet</TitleT2>
                    )}
                  </Button>
                </div>
              </>
            )}
          </header>
          {/*
          ###############################################################################
          #
          #                                                                          MAIN
          #
          ###############################################################################
          */}
          <div className="mt-[60px] w-full p-4 sm:mt-0">
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
                <BodyB2 className="whitespace-nowrap rounded border-1 border-primary p-2 text-primary">
                  2 splits & 3 hops
                </BodyB2>
                <BodyB3 className="overflow-hidden text-ellipsis whitespace-nowrap text-buttonSecondary">
                  via Pancakeswap, Cellana, Liquidswap
                </BodyB3>
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
                    <BodyB2 className="whitespace-nowrap">1 USDC = 0.11650797 APT</BodyB2>
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
                    <BodyB2 className=" text-buttonSecondary">
                      {isMoreInfo ? (isSm ? "Less" : "Less Info") : isSm ? "More" : "More info"}
                    </BodyB2>
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
                      <Tooltip
                        content="I am a tooltip I am a tooltip I am a tooltip I am a tooltip"
                        closeDelay={0}
                        showArrow
                        placement="right"
                        isOpen={tooltipPriceImpact}
                      >
                        <BodyB2
                          className="border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
                          tabIndex={0}
                          onMouseEnter={() => isDesktop && setTooltipPriceImpact(true)}
                          onMouseLeave={() => isDesktop && setTooltipPriceImpact(false)}
                          onClick={() => !isDesktop && setTooltipPriceImpact(!tooltipPriceImpact)}
                          ref={tooltipPriceImpactRef}
                        >
                          Price Impact
                        </BodyB2>
                      </Tooltip>
                      <BodyB2>~0.2574%</BodyB2>
                    </div>
                    <div className="flex justify-between">
                      <Tooltip
                        content="I am a tooltip I am a tooltip I am a tooltip"
                        closeDelay={0}
                        showArrow
                        placement="right"
                        isOpen={tooltipMinimumReceive}
                      >
                        <BodyB2
                          className="border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
                          tabIndex={0}
                          onMouseEnter={() => isDesktop && setTooltipMinimumReceive(true)}
                          onMouseLeave={() => isDesktop && setTooltipMinimumReceive(false)}
                          onClick={() => !isDesktop && setTooltipMinimumReceive(!tooltipMinimumReceive)}
                          ref={tooltipMinimumReceiveRef}
                        >
                          Minimum Receive
                        </BodyB2>
                      </Tooltip>
                      <BodyB2>1.157999822 APT</BodyB2>
                    </div>
                    <div className="flex justify-between">
                      <Tooltip
                        content="I am a tooltip I am a tooltip"
                        closeDelay={0}
                        showArrow
                        placement="right"
                        isOpen={tooltipMaxTxFee}
                      >
                        <BodyB2
                          className="border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
                          tabIndex={0}
                          onMouseEnter={() => isDesktop && setTooltipMaxTxFee(true)}
                          onMouseLeave={() => isDesktop && setTooltipMaxTxFee(false)}
                          onClick={() => !isDesktop && setTooltipMaxTxFee(!tooltipMaxTxFee)}
                          ref={tooltipMaxTxFeeRef}
                        >
                          Max Transaction Fee
                        </BodyB2>
                      </Tooltip>
                      <BodyB2>0.000305 APT</BodyB2>
                    </div>
                  </>
                )}
              </div>

              <Spacer y={4} />

              <div className="flex items-center justify-between gap-4">
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
                  <Link
                    isBlock
                    showAnchorIcon
                    href="#"
                    color="primary"
                    className="p-0 text-buttonSecondary"
                    size="sm"
                    isExternal
                  >
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

              <div className="flex items-center justify-between gap-4">
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
                  <Link
                    isBlock
                    showAnchorIcon
                    href="#"
                    color="primary"
                    className="p-0 text-buttonSecondary"
                    size="sm"
                    isExternal
                  >
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
          <footer className="fixed bottom-0 flex h-[84px] w-full content-center items-center justify-between px-[60px] lg:px-[30px] md:static md:px-[16px]">
            <BodyB2 className="text-buttonSecondary">© Anqa 2024</BodyB2>
            <div className="flex items-center gap-5 md:gap-0">
              <Link
                isBlock
                href="#"
                color="primary"
                className="text-buttonSecondary"
                size="sm"
                isExternal
                showAnchorIcon
              >
                <BodyB2>Term & Condition</BodyB2>
              </Link>
              {isSm ? (
                <div />
              ) : (
                <>
                  <Link
                    isBlock
                    href="#"
                    color="primary"
                    className="text-buttonSecondary"
                    size="sm"
                    isExternal
                    showAnchorIcon
                  >
                    <BodyB2>Privacy Policy</BodyB2>
                  </Link>
                  <Link
                    isBlock
                    href="#"
                    color="primary"
                    className="text-buttonSecondary"
                    size="sm"
                    isExternal
                    showAnchorIcon
                  >
                    <BodyB2>Cookies</BodyB2>
                  </Link>
                </>
              )}
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
