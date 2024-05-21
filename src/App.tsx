import { Button, Image, Link, Spacer, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import { INetwork, IPetraConnectResponse, martian, petra } from "../global"
import { Chart1, Chart2 } from "./components/Chart"
import { AnqaIcon, ArrowFilledDownIcon, SettingIcon, SwapIcon } from "./components/Icons"
import { NumberInput, NumberInput2 } from "./components/NumberInput"
import { BodyB2, BodyB3, TitleT2 } from "./components/Texts"
import Tooltips from "./components/Tooltips"
import ModalConnectWallet from "./components/modals/ModalConnectWallet"
import { useIsSm } from "./hooks/useMedia"
import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { updateNetwork, updateWalletAddress } from "./redux/slices/wallet"
import useMartian from "./redux/hooks/useMartian"
import usePetra from "./redux/hooks/usePetra"

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

function WalletUpdater() {
  const dispatch = useAppDispatch()

  const { onConnect: onConnectPetra } = usePetra()

  useEffect(() => {
    if (!martian) return
    martian.onNetworkChange((network: INetwork) => dispatch(updateNetwork(network)))
    martian.onAccountChange((walletAddress: string) => dispatch(updateWalletAddress(walletAddress)))
  }, [dispatch])

  useEffect(() => {
    if (!petra) return
    petra.onNetworkChange((network: INetwork) => dispatch(updateNetwork(network)))
    petra.onAccountChange((response: IPetraConnectResponse) => {
      // WARN: Why it's render 8 times in here for each switching?!
      // console.log("response.address", response.address)

      // If the new account has already connected to your app then the newAccount will be returned
      if (response) {
        dispatch(updateWalletAddress(response.address))
      } else void onConnectPetra() // Otherwise you will need to ask to connect to the new account
    })
  }, [dispatch, onConnectPetra])

  return null
}

export default function App() {
  const [isSwapping] = useState(false)
  // const onSwap = () => {
  //   setIsSwapping(true)
  //   setTimeout(() => {
  //     setIsSwapping(false)
  //   }, 1000)
  // }

  const [isMoreInfo, setIsMoreInfo] = useState(false)
  const onToggleMoreInfo = () => {
    setIsMoreInfo((prev) => !prev)
  }

  const isSm = useIsSm()

  const connectedWallet = useAppSelector((state) => state.wallet.walletAddress)
  const network = useAppSelector((state) => state.wallet.network)
  const isMainnet = network === INetwork.Mainnet

  const {
    isOpen: isOpenModalConnectWallet,
    onOpen: onOpenModalConnectWallet,
    onClose: onCloseModalConnectWallet,
    onOpenChange: onOpenChangeModalConnectWallet,
  } = useDisclosure()

  const provider = useAppSelector((state) => state.wallet.provider)
  const { onDisconnect: onDisconnectMartian } = useMartian()
  const { onDisconnect: onDisconnectPetra } = usePetra()
  const onDisconnect = async () => {
    switch (provider) {
      case "Martian":
        await onDisconnectMartian()
        break
      case "Petra":
        await onDisconnectPetra()
    }
  }

  return (
    <>
      <WalletUpdater />
      <div className="h-full bg-background text-foreground dark">
        <div className="h-full w-screen">
          <div className="fixed top-0 h-full w-screen bg-[url('/images/background.svg')] bg-cover bg-bottom bg-no-repeat opacity-40" />
          <div className="isolate flex min-h-screen flex-col">
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
                      onPress={connectedWallet ? onDisconnect : onOpenModalConnectWallet}
                      isLoading={isOpenModalConnectWallet}
                      variant={connectedWallet ? "bordered" : "solid"}
                      disabled={!!connectedWallet}
                    >
                      {connectedWallet && isMainnet && (
                        <Image
                          width={20}
                          src={
                            provider === "Martian"
                              ? "/images/martian.jpeg"
                              : provider === "Petra"
                                ? "/images/petra.svg"
                                : undefined
                          }
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
            <main className="mt-[60px] w-full p-4 sm:mt-0">
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

                <Button
                  className="anqa-hover-primary-all flex h-fit min-h-fit cursor-pointer items-center gap-3 rounded-none bg-transparent p-0 data-[hover]:bg-transparent"
                  disableAnimation
                  disableRipple
                >
                  <BodyB2 className="whitespace-nowrap rounded border-1 border-primary p-2 text-primary">
                    2 splits & 3 hops
                  </BodyB2>
                  <BodyB3 className="overflow-hidden text-ellipsis whitespace-nowrap text-buttonSecondary">
                    via Pancakeswap, Cellana, Liquidswap
                  </BodyB3>
                  <ArrowFilledDownIcon size={24} className="ml-auto -rotate-90" color="#9AA0A6" />
                </Button>

                <Spacer y={3} />

                <Button
                  color="primary"
                  className="h-[52px] rounded"
                  isLoading={isSwapping}
                  onPress={connectedWallet ? onDisconnect : onOpenModalConnectWallet}
                >
                  <TitleT2>{connectedWallet ? "Disconnect" : "Connect 022543"}</TitleT2>
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
                    <Button
                      variant="light"
                      className="anqa-hover-white-all h-fit w-fit min-w-fit gap-0 p-0 data-[hover]:bg-transparent"
                      disableRipple
                      disableAnimation
                      onPress={onToggleMoreInfo}
                      endContent={
                        <ArrowFilledDownIcon
                          size={24}
                          className={`${isMoreInfo ? "rotate-180" : ""}`}
                          color="#9AA0A6"
                        />
                      }
                    >
                      <BodyB2 className="pl-1.5 text-buttonSecondary">
                        {isMoreInfo ? (isSm ? "Less" : "Less Info") : isSm ? "More" : "More info"}
                      </BodyB2>
                    </Button>
                  </div>
                  {isMoreInfo && (
                    <>
                      <div className="flex items-center justify-between">
                        <BodyB2
                          className="border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
                          tabIndex={0}
                          data-tooltip-id="tooltip-price-impact"
                        >
                          Price Impact
                        </BodyB2>
                        <BodyB2>~0.2574%</BodyB2>
                      </div>
                      <div className="flex items-center justify-between">
                        <BodyB2
                          className="border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
                          tabIndex={0}
                          data-tooltip-id="tooltip-minimum-receive"
                        >
                          Minimum Receive
                        </BodyB2>
                        <BodyB2>1.157999822 APT</BodyB2>
                      </div>
                      <div className="flex items-center justify-between">
                        <BodyB2
                          className="border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
                          tabIndex={0}
                          data-tooltip-id="tooltip-estimated-gas-fee"
                        >
                          Estimated gas fee
                        </BodyB2>
                        <BodyB2
                          className="border-b-1 border-dashed border-white"
                          tabIndex={0}
                          data-tooltip-id="tooltip-estimated-gas-fee-value"
                          data-tooltip-content="0.00028123 APT"
                        >
                          $0.042
                        </BodyB2>
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
            </main>

            {/*
          ###############################################################################
          #
          #                                                                        FOOTER
          #
          ###############################################################################
          */}
            <footer className="flex w-full flex-1 items-end">
              <div className="flex h-[84px] w-full content-center items-center justify-between px-[60px] lg:px-[30px] md:static md:px-[16px]">
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
              </div>
            </footer>
          </div>
        </div>
      </div>
      <Tooltips />
      <ModalConnectWallet
        isOpen={isOpenModalConnectWallet}
        onOpenChange={onOpenChangeModalConnectWallet}
        onClose={onCloseModalConnectWallet}
      />
    </>
  )
}
