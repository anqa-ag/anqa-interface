import { Network, APTOS_COIN } from "@aptos-labs/ts-sdk"
import { parseUnits } from "@ethersproject/units"
import { Button, Image, Link, Skeleton, Spacer, useDisclosure } from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import { useDebounceValue } from "usehooks-ts"
import { Chart1, Chart2 } from "./components/Chart"
import { AnqaIcon, ArrowFilledDownIcon, SettingIcon, SwapIcon, WalletIcon } from "./components/Icons"
import { BodyB2, BodyB3, TitleT1, TitleT2 } from "./components/Texts"
import Tooltips from "./components/Tooltips"
import ModalConnectWallet from "./components/modals/ModalConnectWallet"
import ModalSelectToken from "./components/modals/ModalSelectToken"
import { NOT_FOUND_TOKEN_LOGO_URL, USDC_WORMHOLE } from "./constants"
import { useIsSm } from "./hooks/useMedia"
import useQuote from "./hooks/useQuote"
import { useAppSelector } from "./redux/hooks"
import useMartian from "./redux/hooks/useMartian"
import usePetra from "./redux/hooks/usePetra"
import Updaters from "./redux/updaters/Updaters"
import { Fraction } from "./utils/fraction"
import {
  escapeRegExp,
  inputRegex,
  numberWithCommas,
  mulpowToFraction,
  divpowToFraction,
  truncateValue,
} from "./utils/number"

function Menu() {
  return (
    <div className="flex items-center gap-4 md:justify-center md:gap-2">
      <Button
        variant="light"
        className="min-w-0 rounded border-1 border-primaryHover px-4"
        endContent={<SwapIcon size={20} color="#0CA0EB" />}
      >
        <TitleT2 className="text-primaryHover">Trade</TitleT2>
      </Button>
      <Button variant="light" className="gap-1 rounded px-4" isDisabled>
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

  const [isMoreInfo, setIsMoreInfo] = useState(false)
  const onToggleMoreInfo = () => {
    setIsMoreInfo((prev) => !prev)
  }

  const isSm = useIsSm()

  const { walletAddress: connectedWallet, balance, network } = useAppSelector((state) => state.wallet)
  const isMainnet = network === Network.MAINNET

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

  const [tokenIn, _setTokenIn] = useState(APTOS_COIN)
  const [tokenOut, _setTokenOut] = useState(USDC_WORMHOLE)
  const setTokenIn = useCallback(
    (id: string) => {
      if (tokenOut === id) {
        _setTokenIn(id)
        _setTokenOut(tokenIn)
      } else {
        _setTokenIn(id)
      }
    },
    [tokenIn, tokenOut],
  )
  const setTokenOut = useCallback(
    (id: string) => {
      if (tokenIn === id) {
        _setTokenOut(id)
        _setTokenIn(tokenOut)
      } else {
        _setTokenOut(id)
      }
    },
    [tokenIn, tokenOut],
  )

  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
  const tokenInInfo = useMemo(() => followingTokenData[tokenIn], [followingTokenData, tokenIn])
  const tokenOutInfo = useMemo(() => followingTokenData[tokenOut], [followingTokenData, tokenOut])

  const tokenInDecimals = tokenInInfo ? tokenInInfo.decimals : undefined
  const tokenOutDecimals = tokenOutInfo ? tokenOutInfo.decimals : undefined

  const followingPriceData = useAppSelector((state) => state.price.followingPriceData)
  const fractionalPriceTokenIn = useMemo(
    () => (followingPriceData[tokenIn] ? mulpowToFraction(followingPriceData[tokenIn]) : undefined),
    [followingPriceData, tokenIn],
  )
  const fractionalPriceTokenOut = useMemo(
    () => (followingPriceData[tokenOut] ? mulpowToFraction(followingPriceData[tokenOut]) : undefined),
    [followingPriceData, tokenOut],
  )

  const balanceTokenIn = balance[tokenIn]
  const fractionalBalanceTokenIn =
    balanceTokenIn && tokenInDecimals ? divpowToFraction(balanceTokenIn.amount, tokenInDecimals) : undefined
  const balanceTokenOut = balance[tokenOut]
  const fractionalBalanceTokenOut =
    balanceTokenOut && tokenOutDecimals ? divpowToFraction(balanceTokenOut.amount, tokenOutDecimals) : undefined

  const [typedAmountIn, _setTypedAmountIn] = useState("")
  const setTypedAmountIn = useCallback((value: string, decimals = 8) => {
    if (value === "" || inputRegex.test(escapeRegExp(value))) {
      value = truncateValue(value, decimals)
      if (value.length && value.startsWith(".")) value = "0."
      _setTypedAmountIn(value)
    }
  }, [])
  const _fractionalAmountIn = useMemo(() => {
    if (!typedAmountIn) return undefined
    if (!tokenInDecimals) return
    const typedValueParsed = parseUnits(typedAmountIn, tokenInDecimals).toString()
    return new Fraction(typedValueParsed, Math.pow(10, tokenInDecimals))
  }, [tokenInDecimals, typedAmountIn])
  const [fractionalAmountIn] = useDebounceValue(_fractionalAmountIn, 250)

  const {
    amountOut,
    isValidating: isValidatingQuote,
    sourceInfo,
  } = useQuote(tokenIn, tokenOut, fractionalAmountIn?.numerator?.toString())
  const fractionalAmountOut = useMemo(
    () => (amountOut && tokenOutDecimals ? new Fraction(amountOut, Math.pow(10, tokenOutDecimals)) : undefined),
    [tokenOutDecimals, amountOut],
  )

  const fractionalAmountInUsd =
    fractionalAmountIn && fractionalPriceTokenIn ? fractionalAmountIn.multiply(fractionalPriceTokenIn) : undefined
  const fractionalAmountOutUsd =
    fractionalAmountOut && fractionalPriceTokenOut ? fractionalAmountOut.multiply(fractionalPriceTokenOut) : undefined

  const rate = fractionalAmountIn && fractionalAmountOut ? fractionalAmountOut.divide(fractionalAmountIn) : undefined
  let priceImpact =
    fractionalAmountInUsd && fractionalAmountOutUsd
      ? fractionalAmountOutUsd.subtract(fractionalAmountInUsd).divide(fractionalAmountOutUsd).multiply(100)
      : undefined
  if (priceImpact?.lessThan(0)) {
    priceImpact = priceImpact.multiply(-1)
  }
  const minimumReceive = fractionalAmountOut ? fractionalAmountOut.multiply(995).divide(1000) : undefined // TODO: Add slippage later.

  const [isInvert, setIsInvert] = useState(false)

  const fractionalFeeAmount = useMemo(() => new Fraction(123, 1000000), [])
  const isSufficientBalance =
    fractionalBalanceTokenIn && fractionalAmountIn
      ? fractionalBalanceTokenIn.subtract(fractionalFeeAmount).equalTo(fractionalAmountIn) ||
        fractionalBalanceTokenIn.subtract(fractionalFeeAmount).greaterThan(fractionalAmountIn)
        ? true
        : false
      : undefined

  const swapButton = useMemo(() => {
    if (!fractionalAmountIn) return { isDisabled: true, text: "Enter an amount" }
    if (!fractionalBalanceTokenIn) return { isDisabled: true, text: "Checking balance..." }
    if (!isSufficientBalance) return { isDisabled: true, text: "Insufficient balance" }
    if (isValidatingQuote) return { isDisabled: true, text: "Getting quote..." }
    if (!fractionalAmountOut) return { isDisabled: true, text: "Not found route" }
    return { isDisabled: false, text: "Swap" }
  }, [fractionalAmountIn, fractionalBalanceTokenIn, isSufficientBalance, isValidatingQuote, fractionalAmountOut])

  const {
    isOpen: isOpenModalSelectTokenIn,
    onOpen: onOpenModalSelectTokenIn,
    onClose: onCloseModalSelectTokenIn,
    onOpenChange: onOpenChangeModalSelectTokenIn,
  } = useDisclosure()
  const {
    isOpen: isOpenModalSelectTokenOut,
    onOpen: onOpenModalSelectTokenOut,
    onClose: onCloseModalSelectTokenOut,
    onOpenChange: onOpenChangeModalSelectTokenOut,
  } = useDisclosure()

  const [tokenInLogoSrc, setTokenInLogoSrc] = useState(tokenInInfo.logoUrl ?? NOT_FOUND_TOKEN_LOGO_URL)
  const [tokenOutLogoSrc, setTokenOutLogoSrc] = useState(tokenOutInfo.logoUrl ?? NOT_FOUND_TOKEN_LOGO_URL)
  useEffect(() => {
    setTokenInLogoSrc(tokenInInfo.logoUrl ?? NOT_FOUND_TOKEN_LOGO_URL)
    setTokenOutLogoSrc(tokenOutInfo.logoUrl ?? NOT_FOUND_TOKEN_LOGO_URL)
  }, [tokenInInfo.logoUrl, tokenOutInfo.logoUrl])

  const switchToken = useCallback(() => {
    if (fractionalAmountOut && tokenOutDecimals) {
      setTypedAmountIn(truncateValue(fractionalAmountOut.toSignificant(18), tokenOutDecimals), tokenOutDecimals)
    } else {
      setTypedAmountIn("")
    }
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
  }, [fractionalAmountOut, setTokenIn, setTokenOut, setTypedAmountIn, tokenIn, tokenOutDecimals, tokenOut])

  return (
    <>
      <Updaters />
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
                    <Button className="h-[36px] min-w-min gap-1 rounded bg-primaryHover p-2">
                      <TitleT2 className="text-black">Swap</TitleT2>
                    </Button>
                  </div>
                  <Button isIconOnly variant="light" className="h-[36px] w-[36px] min-w-min">
                    <SettingIcon size={36} />
                  </Button>
                </div>

                <Spacer y={4} />

                <div className="relative flex flex-col gap-1">
                  {/* INPUT */}
                  <>
                    <div className="flex flex-col gap-2 rounded border-1 border-buttonDisabled bg-buttonDisabled p-3 transition focus-within:border-buttonSecondary">
                      <div className="flex items-center justify-between">
                        <BodyB2 className="text-buttonSecondary">You pay</BodyB2>
                        {connectedWallet && (
                          <Button
                            className="anqa-hover-white-all flex h-fit w-fit min-w-fit items-center gap-1 bg-transparent p-0"
                            disableAnimation
                            disableRipple
                          >
                            <WalletIcon size={24} />
                            <BodyB2 className="text-buttonSecondary">
                              {fractionalBalanceTokenIn
                                ? numberWithCommas(fractionalBalanceTokenIn.toSignificant(6))
                                : "0"}
                            </BodyB2>
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <input
                          inputMode="decimal"
                          autoComplete="off"
                          autoCorrect="off"
                          type="text"
                          placeholder="0.00"
                          minLength={1}
                          maxLength={79}
                          spellCheck="false"
                          className="w-full bg-transparent text-[36px] font-semibold outline-none placeholder:text-buttonSecondary"
                          pattern="^[0-9]*[.,]?[0-9]*$"
                          value={typedAmountIn}
                          onChange={(e) => setTypedAmountIn(e.target.value, tokenInDecimals)}
                        />
                        <Button
                          className="flex h-[42px] w-fit min-w-fit items-center gap-1 rounded-full border-1 border-buttonDisabled bg-transparent p-2 transition hover:border-buttonSecondary data-[hover]:bg-transparent"
                          disableAnimation
                          disableRipple
                          onPress={onOpenModalSelectTokenIn}
                        >
                          <Image
                            width={20}
                            height={20}
                            className="min-h-[20px] min-w-[20px]"
                            src={tokenInLogoSrc}
                            onError={() => setTokenInLogoSrc(NOT_FOUND_TOKEN_LOGO_URL)}
                          />
                          <TitleT1 className="whitespace-nowrap">{tokenInInfo.symbol}</TitleT1>
                          <ArrowFilledDownIcon size={20} />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <BodyB2 className="text-buttonSecondary">
                          {fractionalAmountInUsd
                            ? "~$" + numberWithCommas(fractionalAmountInUsd.toSignificant(6))
                            : "--"}
                        </BodyB2>
                      </div>
                    </div>
                  </>
                  <div className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2">
                    <Button
                      isIconOnly
                      className="rounded-full border-2 border-background bg-buttonDisabled data-[hover]:border-buttonSecondary"
                      onPress={switchToken}
                    >
                      <SwapIcon size={24} color="#FFFFFF" />
                    </Button>
                  </div>
                  {/* OUTPUT */}
                  <>
                    <div className="flex flex-col gap-2 rounded border-1 border-buttonDisabled bg-buttonDisabled p-3 transition focus-within:border-buttonSecondary">
                      <div className="flex items-center justify-between">
                        <BodyB2 className="text-buttonSecondary">You get</BodyB2>
                        {connectedWallet && (
                          <Button
                            className="anqa-hover-white-all flex h-fit w-fit min-w-fit items-center gap-1 bg-transparent p-0"
                            disableAnimation
                            disableRipple
                          >
                            <WalletIcon size={24} />
                            <BodyB2 className="text-buttonSecondary">
                              {fractionalBalanceTokenOut
                                ? numberWithCommas(fractionalBalanceTokenOut.toSignificant(6))
                                : "0"}
                            </BodyB2>
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        {isValidatingQuote ? (
                          <div className="flex h-[54px] w-full items-center">
                            <Skeleton className="h-[38px] w-full rounded" />
                          </div>
                        ) : (
                          <input
                            inputMode="decimal"
                            autoComplete="off"
                            autoCorrect="off"
                            type="text"
                            placeholder="0.00"
                            minLength={1}
                            maxLength={79}
                            spellCheck="false"
                            className="w-full bg-transparent text-[36px] font-semibold outline-none placeholder:text-buttonSecondary"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            disabled
                            data-tooltip-id="tooltip-input-amount-out"
                            value={
                              fractionalAmountOut && tokenOutDecimals
                                ? truncateValue(fractionalAmountOut.toSignificant(18), tokenOutDecimals)
                                : ""
                            }
                          />
                        )}
                        <Button
                          className="flex h-[42px] w-fit min-w-fit items-center gap-1 rounded-full border-1 border-buttonDisabled bg-transparent p-2 transition hover:border-buttonSecondary data-[hover]:bg-transparent"
                          disableAnimation
                          disableRipple
                          onPress={onOpenModalSelectTokenOut}
                        >
                          <Image
                            width={20}
                            height={20}
                            className="min-h-[20px] min-w-[20px]"
                            src={tokenOutLogoSrc}
                            onError={() => setTokenOutLogoSrc(NOT_FOUND_TOKEN_LOGO_URL)}
                          />
                          <TitleT1 className="whitespace-nowrap">{tokenOutInfo.symbol}</TitleT1>
                          <ArrowFilledDownIcon size={20} />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <BodyB2 className="text-buttonSecondary">
                          {fractionalAmountOutUsd
                            ? "~$" + numberWithCommas(fractionalAmountOutUsd.toSignificant(6))
                            : "--"}
                        </BodyB2>
                      </div>
                    </div>
                  </>
                </div>

                {isValidatingQuote ? (
                  <>
                    <Spacer y={3} />
                    <div className="flex h-[38px] w-full items-center">
                      <Skeleton className="h-[38px] w-full rounded" />
                    </div>
                    <Spacer y={3} />
                  </>
                ) : sourceInfo ? (
                  <>
                    <Spacer y={3} />
                    <Button
                      className="anqa-hover-primary-all flex h-fit min-h-fit cursor-pointer items-center gap-3 rounded-none bg-transparent p-0 data-[hover]:bg-transparent"
                      disableAnimation
                      disableRipple
                    >
                      <BodyB2 className="whitespace-nowrap rounded border-1 border-primary p-2 text-primary">
                        {sourceInfo.numberOfPaths} splits & {sourceInfo.numberOfPools} hops
                      </BodyB2>
                      <BodyB3 className="overflow-hidden text-ellipsis whitespace-nowrap text-buttonSecondary">
                        via {sourceInfo.uniqueSourceNames.join(", ")}
                      </BodyB3>
                      <ArrowFilledDownIcon size={24} className="ml-auto -rotate-90" color="#9AA0A6" />
                    </Button>
                    <Spacer y={3} />
                  </>
                ) : (
                  <Spacer y={4} />
                )}

                {connectedWallet ? (
                  <Button
                    color="primary"
                    className="h-[52px] rounded"
                    isLoading={isSwapping}
                    onPress={onSwap}
                    isDisabled={swapButton.isDisabled}
                  >
                    <TitleT2>{swapButton.text}</TitleT2>
                  </Button>
                ) : (
                  <Button color="primary" className="h-[52px] rounded" onPress={onOpenModalConnectWallet}>
                    <TitleT2>Connect Wallet</TitleT2>
                  </Button>
                )}

                <Spacer y={4} />

                {fractionalAmountIn && fractionalAmountOut && (
                  <>
                    <div className="flex flex-col gap-2 rounded-lg border-1 border-buttonSecondary p-3">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          {isValidatingQuote ? (
                            <>
                              <div className="flex h-[20px] w-[150px] items-center">
                                <Skeleton className="h-[20px] w-full rounded" />
                              </div>
                            </>
                          ) : isInvert ? (
                            <Button
                              onPress={() => setIsInvert((prev) => !prev)}
                              variant="light"
                              className="m-0 h-fit p-0"
                              disableAnimation
                              disableRipple
                            >
                              <BodyB2 className="whitespace-nowrap">
                                {rate
                                  ? `1 ${tokenOutInfo.symbol} = ${numberWithCommas(rate.invert().toSignificant(6))} ${tokenInInfo.symbol}`
                                  : "--"}
                              </BodyB2>
                            </Button>
                          ) : (
                            <Button
                              onPress={() => setIsInvert((prev) => !prev)}
                              variant="light"
                              className="m-0 h-fit p-0"
                              disableAnimation
                              disableRipple
                            >
                              <BodyB2 className="whitespace-nowrap">
                                {rate
                                  ? `1 ${tokenInInfo.symbol} = ${numberWithCommas(rate.toSignificant(6))} ${tokenOutInfo.symbol}`
                                  : "--"}
                              </BodyB2>
                            </Button>
                          )}
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
                            {({ remainingTime }) => (
                              <div className="text-[8px] text-buttonSecondary">{remainingTime}</div>
                            )}
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
                            {isValidatingQuote ? (
                              <>
                                <div className="flex h-[20px] w-[50px] items-center">
                                  <Skeleton className="h-[20px] w-full rounded" />
                                </div>
                              </>
                            ) : (
                              <BodyB2>{priceImpact ? `~${priceImpact.toSignificant(4)}%` : "--"}</BodyB2>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <BodyB2
                              className="border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
                              tabIndex={0}
                              data-tooltip-id="tooltip-minimum-receive"
                            >
                              Minimum Receive
                            </BodyB2>
                            {isValidatingQuote ? (
                              <>
                                <div className="flex h-[20px] w-[100px] items-center">
                                  <Skeleton className="h-[20px] w-full rounded" />
                                </div>
                              </>
                            ) : (
                              <BodyB2>
                                {minimumReceive ? `${numberWithCommas(minimumReceive.toSignificant(6))} USDC` : "--"}
                              </BodyB2>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <BodyB2
                              className="border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
                              tabIndex={0}
                              data-tooltip-id="tooltip-estimated-gas-fee"
                            >
                              Estimated gas fee
                            </BodyB2>
                            {isValidatingQuote ? (
                              <>
                                <div className="flex h-[20px] w-[50px] items-center">
                                  <Skeleton className="h-[20px] w-full rounded" />
                                </div>
                              </>
                            ) : (
                              <BodyB2
                                className="border-b-1 border-dashed border-white"
                                tabIndex={0}
                                data-tooltip-id="tooltip-estimated-gas-fee-value"
                                data-tooltip-content="0.000123 APT"
                              >
                                TODO
                              </BodyB2>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <Spacer y={4} />
                  </>
                )}

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Image width={20} height={20} className="min-h-[20px] min-w-[20px]" src={tokenInLogoSrc} />
                      <TitleT2 className="whitespace-nowrap">{tokenInInfo.symbol}</TitleT2>
                    </div>
                    <Link
                      isBlock
                      showAnchorIcon
                      href={`https://aptoscan.com/coin/${tokenInInfo.id}`}
                      color="primary"
                      className="p-0 text-buttonSecondary"
                      size="sm"
                      isExternal
                    >
                      <BodyB3 className="text-buttonSecondary">{`${tokenInInfo.id.slice(0, 10)}...`}</BodyB3>
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
                      <Image width={20} height={20} className="min-h-[20px] min-w-[20px]" src={tokenOutLogoSrc} />
                      <TitleT2 className="whitespace-nowrap">{tokenOutInfo.symbol}</TitleT2>
                    </div>
                    <Link
                      isBlock
                      showAnchorIcon
                      href={`https://aptoscan.com/coin/${tokenOutInfo.id}`}
                      color="primary"
                      className="p-0 text-buttonSecondary"
                      size="sm"
                      isExternal
                    >
                      <BodyB3 className="text-buttonSecondary">{`${tokenOutInfo.id.slice(0, 10)}...`}</BodyB3>
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
              <div className="flex h-[84px] w-full content-center items-center justify-between px-[60px] lg:px-[30px] md:static md:px-[16px] sm:justify-center">
                <BodyB2 className="text-buttonSecondary">
                  © Anqa 2024 [version: {import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA.slice(0, 7)}]
                </BodyB2>

                {isSm ? (
                  <div />
                ) : (
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
                  </div>
                )}
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
      <ModalSelectToken
        isOpen={isOpenModalSelectTokenIn}
        onOpenChange={onOpenChangeModalSelectTokenIn}
        onClose={onCloseModalSelectTokenIn}
        setToken={setTokenIn}
      />
      <ModalSelectToken
        isOpen={isOpenModalSelectTokenOut}
        onOpenChange={onOpenChangeModalSelectTokenOut}
        onClose={onCloseModalSelectTokenOut}
        setToken={setTokenOut}
      />
    </>
  )
}
