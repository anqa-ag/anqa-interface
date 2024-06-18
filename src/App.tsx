import { APTOS_COIN, Network } from "@aptos-labs/ts-sdk"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { Icon } from "@iconify/react"
import { Button, Image, Link, Skeleton, Spacer } from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import { NumericFormat } from "react-number-format"
import { useSearchParams } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { useDebounceValue } from "usehooks-ts"
import { AnqaWithTextIcon, ArrowFilledDownIcon, SettingIcon, SwapIcon, WalletIcon } from "./components/Icons"
import { BodyB2, BodyB3, TitleT1, TitleT2, TitleT4 } from "./components/Texts"
import Tooltips from "./components/Tooltips"
import ModalConnectWallet from "./components/modals/ModalConnectWallet"
import ModalSelectToken from "./components/modals/ModalSelectToken"
import ModalTradeRoute from "./components/modals/ModalTradeRoute"
import ModalUserSetting from "./components/modals/ModalUserSetting"
import {
  BIP_BASE,
  NOT_FOUND_TOKEN_LOGO_URL,
  ZUSDC,
  martianWallet,
  okxWallet,
  petraWallet,
  pontemWallet,
} from "./constants"
import { useIsMd, useIsSm } from "./hooks/useMedia"
import useModal, { MODAL_LIST } from "./hooks/useModal"
import useQuote from "./hooks/useQuote"
import useSwap from "./hooks/useSwap"
import { useAppSelector } from "./redux/hooks"
import { Token } from "./redux/slices/token"
import Updaters from "./redux/updaters/Updaters"
import { Fraction } from "./utils/fraction"
import {
  divpowToFraction,
  escapeRegExp,
  inputRegex,
  mulpowToFraction,
  numberWithCommas,
  truncateValue,
} from "./utils/number"
import { SOURCES } from "./constants/source"

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

function ButtonConnectWallet({
  onOpenModalConnectWallet,
  isOpenModalConnectWallet,
}: {
  onOpenModalConnectWallet: () => void
  isOpenModalConnectWallet: boolean
}) {
  const { account, network, disconnect, wallet, connected, isLoading: isLoadingWallet } = useWallet()
  const isMainnet = network ? network.name === Network.MAINNET : undefined

  return (
    <div className="flex-1 text-end">
      <Button
        color="primary"
        className={
          "w-fit rounded px-4" +
          " " +
          (connected
            ? "border-buttonSecondary bg-background text-buttonSecondary"
            : "border-primary bg-primary text-white")
        }
        onPress={connected ? disconnect : onOpenModalConnectWallet}
        isLoading={isOpenModalConnectWallet || isLoadingWallet}
        variant={connected ? "bordered" : "solid"}
      >
        {wallet && connected && (
          <Image
            width={20}
            className="min-w-[20px]"
            src={
              wallet.name === petraWallet.name
                ? "/images/petra.svg"
                : wallet.name === martianWallet.name
                  ? "/images/martian.jpeg"
                  : wallet.name === pontemWallet.name
                    ? "/images/pontem.svg"
                    : wallet.name === okxWallet.name
                      ? "/images/okx.png"
                      : undefined
            }
          />
        )}
        {connected && account?.address ? (
          isMainnet ? (
            <TitleT2>{account.address.slice(0, 4) + "..." + account.address.slice(-4)}</TitleT2>
          ) : (
            <TitleT2>Wrong Network ({network})</TitleT2>
          )
        ) : isLoadingWallet ? (
          <TitleT2>Loading Wallet</TitleT2>
        ) : (
          <TitleT2>Connect Wallet</TitleT2>
        )}
      </Button>
    </div>
  )
}

export default function App() {
  const isSm = useIsSm()
  const isMd = useIsMd()

  const { balance } = useAppSelector((state) => state.wallet)
  const { isLoading: isLoadingWallet, account } = useWallet()
  const connectedWallet = useMemo(() => (account ? account.address : undefined), [account])

  const [typedAmountIn, _setTypedAmountIn] = useState("")
  const [shouldUseDebounceAmountIn, setShouldUseDebounceAmountIn] = useState(true)
  const setTypedAmountIn = useCallback((value: string, decimals = 8, shouldUseDebounce = true) => {
    setShouldUseDebounceAmountIn(shouldUseDebounce)
    if (value?.endsWith(",")) {
      value = value.slice(0, value.length - 1) + "."
    }
    value = value.replaceAll(",", "")
    if (value === "" || inputRegex.test(escapeRegExp(value))) {
      value = truncateValue(value, decimals)
      if (value.length && value.startsWith(".")) value = "0."
      value = numberWithCommas(value)
      _setTypedAmountIn(value)
    }
  }, [])

  const [tokenIn, _setTokenIn] = useState(APTOS_COIN)
  const [tokenOut, _setTokenOut] = useState(ZUSDC)

  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
  const tokenInInfo: Token | undefined = useMemo(() => followingTokenData[tokenIn], [followingTokenData, tokenIn])
  const tokenOutInfo: Token | undefined = useMemo(() => followingTokenData[tokenOut], [followingTokenData, tokenOut])

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
    balanceTokenIn && tokenInDecimals !== undefined
      ? divpowToFraction(balanceTokenIn.amount, tokenInDecimals)
      : undefined
  const balanceTokenOut = balance[tokenOut]
  const fractionalBalanceTokenOut =
    balanceTokenOut && tokenOutDecimals !== undefined
      ? divpowToFraction(balanceTokenOut.amount, tokenOutDecimals)
      : undefined

  const _fractionalAmountIn = useMemo(
    () =>
      typedAmountIn && tokenInDecimals !== undefined
        ? mulpowToFraction(typedAmountIn.replaceAll(",", ""), tokenInDecimals)
        : undefined,
    [tokenInDecimals, typedAmountIn],
  )
  const [fractionalAmountIn] = useDebounceValue(_fractionalAmountIn, shouldUseDebounceAmountIn ? 250 : 0)

  const [source, setSource] = useState("")

  const {
    amountOut,
    isValidating: isValidatingQuote,
    sourceInfo,
    paths,
  } = useQuote(tokenIn, tokenOut, fractionalAmountIn?.numerator?.toString(), source)
  const fractionalAmountOut = useMemo(
    () =>
      amountOut && tokenOutDecimals != undefined ? new Fraction(amountOut, Math.pow(10, tokenOutDecimals)) : undefined,
    [tokenOutDecimals, amountOut],
  )

  const readbleAmountOut =
    fractionalAmountOut && tokenOutDecimals !== undefined
      ? numberWithCommas(truncateValue(fractionalAmountOut.toFixed(18), tokenOutDecimals))
      : ""

  const fractionalAmountInUsd = useMemo(
    () =>
      fractionalAmountIn && fractionalPriceTokenIn ? fractionalAmountIn.multiply(fractionalPriceTokenIn) : undefined,
    [fractionalAmountIn, fractionalPriceTokenIn],
  )
  const fractionalAmountOutUsd = useMemo(
    () =>
      fractionalAmountOut && fractionalPriceTokenOut
        ? fractionalAmountOut.multiply(fractionalPriceTokenOut)
        : undefined,
    [fractionalAmountOut, fractionalPriceTokenOut],
  )

  const rate = useMemo(
    () => (fractionalAmountIn && fractionalAmountOut ? fractionalAmountOut.divide(fractionalAmountIn) : undefined),
    [fractionalAmountIn, fractionalAmountOut],
  )
  const priceImpact = useMemo(() => {
    let res =
      fractionalAmountInUsd && fractionalAmountOutUsd
        ? fractionalAmountInUsd.subtract(fractionalAmountOutUsd).divide(fractionalAmountInUsd).multiply(100)
        : undefined
    if (res?.lessThan(0)) {
      res = new Fraction(0)
    }
    return res
  }, [fractionalAmountInUsd, fractionalAmountOutUsd])
  const isPriceImpactVeryHigh = useMemo(() => Boolean(priceImpact?.greaterThan(10)), [priceImpact])
  const isPriceImpactHigh = useMemo(() => Boolean(priceImpact?.greaterThan(5)), [priceImpact])

  const slippageBps = useAppSelector((state) => state.user.slippageBps)
  const isHighSlippage = slippageBps >= 500
  const minimumReceived = useMemo(() => {
    if (!fractionalAmountOut) return undefined
    // If any tokens has more than 8 decimals, this assignment will break. I assume 8 is the max decimals in aptos chain? Nevermind, I will use 18.
    const str = fractionalAmountOut
      .multiply(BIP_BASE - slippageBps)
      .divide(BIP_BASE)
      .toFixed(18)
    const res = mulpowToFraction(str, tokenOutDecimals) // To cut redundant decimals.
    return res
  }, [fractionalAmountOut, slippageBps, tokenOutDecimals])

  const [isInvert, setIsInvert] = useState(false)

  const fractionalFeeAmount = useMemo(
    () => (tokenIn === APTOS_COIN ? new Fraction(2, 1000) : new Fraction(0, 1)),
    [tokenIn],
  )
  const isSufficientBalance =
    fractionalBalanceTokenIn && fractionalAmountIn
      ? fractionalBalanceTokenIn.subtract(fractionalFeeAmount).equalTo(fractionalAmountIn) ||
        fractionalBalanceTokenIn.subtract(fractionalFeeAmount).greaterThan(fractionalAmountIn)
        ? true
        : false
      : undefined

  const onSetPercentAmountIn = (percent: number) => {
    if (fractionalBalanceTokenIn && fractionalFeeAmount) {
      let newTypedAmountIn = fractionalBalanceTokenIn.multiply(percent).divide(100)
      if (fractionalBalanceTokenIn.subtract(fractionalFeeAmount).lessThan(newTypedAmountIn)) {
        newTypedAmountIn = newTypedAmountIn.subtract(fractionalFeeAmount)
      }
      if (newTypedAmountIn.greaterThan(0)) {
        const newTypedAmountInStr = newTypedAmountIn.toFixed(18)
        setTypedAmountIn(newTypedAmountInStr, tokenInDecimals, false)
      } else {
        setTypedAmountIn("", tokenInDecimals, false)
      }
    } else {
      setTypedAmountIn("", tokenInDecimals, false)
    }
  }

  const swapButton = useMemo(() => {
    if (!fractionalAmountIn) return { isDisabled: true, text: "Enter an amount" }
    if (!isSufficientBalance) return { isDisabled: true, text: "Insufficient balance" }
    if (isValidatingQuote) return { isDisabled: true, text: "Getting quote..." }
    if (!fractionalAmountOut) return { isDisabled: true, text: "Not found route" }
    return { isDisabled: false, text: "Swap" }
  }, [fractionalAmountIn, isSufficientBalance, isValidatingQuote, fractionalAmountOut])

  const [tokenInLogoSrc, setTokenInLogoSrc] = useState(tokenInInfo?.logoUrl || NOT_FOUND_TOKEN_LOGO_URL)
  const [tokenOutLogoSrc, setTokenOutLogoSrc] = useState(tokenOutInfo?.logoUrl || NOT_FOUND_TOKEN_LOGO_URL)
  useEffect(() => {
    setTokenInLogoSrc(tokenInInfo?.logoUrl || NOT_FOUND_TOKEN_LOGO_URL)
    setTokenOutLogoSrc(tokenOutInfo?.logoUrl || NOT_FOUND_TOKEN_LOGO_URL)
  }, [tokenInInfo?.logoUrl, tokenOutInfo?.logoUrl])

  const switchToken = useCallback(() => {
    if (fractionalAmountOut && tokenOutDecimals !== undefined) {
      setTypedAmountIn(truncateValue(fractionalAmountOut.toFixed(18), tokenOutDecimals), tokenOutDecimals, false)
    } else {
      setTypedAmountIn("")
    }
    _setTokenIn(tokenOut)
    _setTokenOut(tokenIn)
  }, [fractionalAmountOut, setTypedAmountIn, tokenIn, tokenOut, tokenOutDecimals])

  const setTokenIn = useCallback(
    (id: string) => {
      if (tokenOut === id) {
        switchToken()
      } else {
        _setTokenIn(id)
      }
    },
    [switchToken, tokenOut],
  )
  const setTokenOut = useCallback(
    (id: string) => {
      if (tokenIn === id) {
        switchToken()
      } else {
        _setTokenOut(id)
      }
    },
    [switchToken, tokenIn],
  )

  const { globalModal, isModalOpen, onOpenModal, onCloseModal, onOpenChangeModal } = useModal()

  const { txVersion: swapTxVersion, isSwapping, onSwap: _onSwap, success: isSwapSuccess } = useSwap()
  const onSwap = () => {
    if (fractionalAmountIn && fractionalAmountOut && minimumReceived && paths) {
      void _onSwap({
        tokenIn,
        tokenOut,
        amountIn: fractionalAmountIn.numerator.toString(),
        amountOut: fractionalAmountOut.numerator.toString(),
        amountInUsd: fractionalAmountInUsd?.toSignificant(18) || "0",
        amountOutUsd: fractionalAmountOutUsd?.toSignificant(18) || "0",
        minAmountOut: minimumReceived.numerator.toString(),
        paths,
      })
    }
  }

  const [searchParams] = useSearchParams()
  const isDebug = useMemo(() => searchParams.get("debug") === "true", [searchParams])

  return (
    <>
      <Updaters />
      <div className="h-full bg-background text-foreground dark">
        <div className="h-full w-screen">
          <div className="fixed top-0 h-full w-screen bg-[url('/images/background.svg')] bg-cover bg-bottom bg-no-repeat opacity-40" />
          <div className="isolate flex min-h-screen flex-col">
            {isDebug && (
              <div className="absolute left-0 top-1/2 w-[250px] -translate-y-1/2 border-1 border-red-500 p-4">
                <div>💡 Press cmd and click to multiple select source.</div>
                <a
                  href={`https://aptoscan.com/transaction/${swapTxVersion}`}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all"
                >
                  tx_version: {swapTxVersion ? `https://aptoscan.com/transaction/${swapTxVersion}` : "--"}
                </a>
                <div>tx_success: {isSwapSuccess === undefined ? "--" : isSwapSuccess ? "true" : "false"}</div>
                <div>
                  <select
                    className="h-[50vh] border-1 border-red-500"
                    onChange={(e) =>
                      setSource(
                        [...e.currentTarget.options]
                          .filter((op) => op.selected)
                          .map((op) => op.value)
                          .join(","),
                      )
                    }
                    multiple
                  >
                    {Object.keys(SOURCES).map((source) => (
                      <option key={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/*
          ###############################################################################
          #
          #                                                                        HEADER
          #
          ###############################################################################
          */}
            <header className="flex h-[84px] items-center justify-between px-[60px] lg:px-[30px] md:justify-center md:px-[16px]">
              <div className="flex flex-1">
                <Button
                  isIconOnly
                  variant="light"
                  className="h-fit w-fit px-3 py-1 data-[hover]:bg-transparent"
                  disableRipple
                >
                  <AnqaWithTextIcon size={40} />
                </Button>
              </div>
              {isSm ? (
                <ButtonConnectWallet
                  onOpenModalConnectWallet={() => onOpenModal(MODAL_LIST.CONNECT_WALLET)}
                  isOpenModalConnectWallet={globalModal === MODAL_LIST.CONNECT_WALLET && isModalOpen}
                />
              ) : (
                <>
                  <Menu />
                  <ButtonConnectWallet
                    onOpenModalConnectWallet={() => onOpenModal(MODAL_LIST.CONNECT_WALLET)}
                    isOpenModalConnectWallet={globalModal === MODAL_LIST.CONNECT_WALLET && isModalOpen}
                  />
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
              <div className="mx-auto flex max-w-[464px] flex-col">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Button className="h-[36px] min-w-min gap-1 rounded bg-primaryHover p-2">
                      <TitleT2 className="text-black">Swap</TitleT2>
                    </Button>
                  </div>
                  <Button
                    isIconOnly
                    className={
                      "h-[36px] w-[36px] min-w-min rounded border-1 border-black pl-3" +
                      " " +
                      (isHighSlippage ? "bg-[rgba(255,153,1,0.2)]" : "border-black600 bg-black")
                    }
                    onPress={() => onOpenModal(MODAL_LIST.USER_SETTING)}
                  >
                    <BodyB2 className={isHighSlippage ? "text-[rgba(255,153,1)]" : "text-buttonSecondary"}>
                      {slippageBps / 100}%
                    </BodyB2>
                    <SettingIcon size={36} color={isHighSlippage ? "rgba(255,153,1)" : "#9AA0A6"} />
                  </Button>
                </div>

                <Spacer y={4} />

                <div className="relative flex flex-col gap-1">
                  {/* INPUT */}
                  <>
                    <div className="flex flex-col gap-2 rounded border-1 border-black900 bg-black900 p-3 transition focus-within:border-black600">
                      <div className="flex h-[24px] items-center justify-between">
                        <BodyB2 className="text-buttonSecondary">You&apos;re paying</BodyB2>
                        {connectedWallet && (
                          <Button
                            className="anqa-hover-white-all flex h-fit w-fit min-w-fit items-center gap-1 bg-transparent p-0"
                            disableAnimation
                            disableRipple
                            onClick={() => onSetPercentAmountIn(100)}
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
                        <NumericFormat
                          thousandSeparator
                          inputMode="decimal"
                          autoComplete="off"
                          autoCorrect="off"
                          type="text"
                          placeholder="0.00"
                          minLength={1}
                          maxLength={30}
                          spellCheck="false"
                          className="w-full bg-transparent text-[36px] font-semibold outline-none placeholder:text-buttonSecondary"
                          pattern="^[0-9]*[.,]?[0-9]*$"
                          value={typedAmountIn}
                          onChange={(e) => setTypedAmountIn(e.currentTarget.value, tokenInDecimals)}
                        />
                        <Button
                          className="flex h-[42px] w-fit min-w-fit items-center gap-1 rounded-full border-1 border-buttonDisabled bg-transparent p-2 transition hover:border-buttonSecondary data-[hover]:bg-transparent"
                          disableAnimation
                          disableRipple
                          onPress={() => onOpenModal(MODAL_LIST.SELECT_TOKEN_IN)}
                        >
                          <Image
                            width={20}
                            height={20}
                            className="min-h-[20px] min-w-[20px]"
                            src={tokenInLogoSrc}
                            onError={() => setTokenInLogoSrc(NOT_FOUND_TOKEN_LOGO_URL)}
                          />
                          <TitleT1 className="whitespace-nowrap">{tokenInInfo?.symbol ?? "--"}</TitleT1>
                          <ArrowFilledDownIcon size={20} />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <BodyB2 className="text-buttonSecondary">
                          {fractionalAmountInUsd
                            ? "~$" + numberWithCommas(fractionalAmountInUsd.toSignificant(6), false, 2)
                            : "--"}
                        </BodyB2>
                        <div className="flex gap-1 overflow-hidden">
                          <Button
                            className="anqa-hover-white-all h-fit w-fit min-w-fit bg-buttonDisabled px-3 text-buttonSecondary"
                            disableRipple
                            onClick={() => onSetPercentAmountIn(25)}
                          >
                            25%
                          </Button>
                          <Button
                            className="anqa-hover-white-all h-fit w-fit min-w-fit bg-buttonDisabled px-3 text-buttonSecondary"
                            disableRipple
                            onClick={() => onSetPercentAmountIn(50)}
                          >
                            50%
                          </Button>
                          <Button
                            className="anqa-hover-white-all h-fit w-fit min-w-fit bg-buttonDisabled px-3 text-buttonSecondary"
                            disableRipple
                            onClick={() => onSetPercentAmountIn(75)}
                          >
                            75%
                          </Button>
                          <Button
                            className="anqa-hover-white-all h-fit w-fit min-w-fit bg-buttonDisabled px-3 text-buttonSecondary"
                            disableRipple
                            onClick={() => onSetPercentAmountIn(100)}
                          >
                            100%
                          </Button>
                        </div>
                      </div>
                      <Spacer y={2} />
                    </div>
                  </>
                  <div className="absolute left-1/2 top-1/2 z-[1] mt-2 -translate-x-1/2 -translate-y-1/2">
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
                    <div className="flex flex-col gap-2 rounded border-1 border-black900 bg-black900 p-3 transition">
                      <div className="flex h-[24px] items-center justify-between">
                        <BodyB2 className="text-buttonSecondary">To Receive</BodyB2>
                        {connectedWallet && (
                          <Button
                            className="flex h-fit w-fit min-w-fit items-center gap-1 bg-transparent p-0 data-[hover]:opacity-100"
                            disableAnimation
                            disableRipple
                            disabled
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
                          <NumericFormat
                            thousandSeparator
                            inputMode="decimal"
                            autoComplete="off"
                            autoCorrect="off"
                            type="text"
                            placeholder="0.00"
                            minLength={1}
                            maxLength={30}
                            spellCheck="false"
                            className="w-full bg-transparent text-[36px] font-semibold text-buttonSecondary outline-none placeholder:text-buttonSecondary"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            disabled
                            data-tooltip-id="tooltip-input-amount-out"
                            value={readbleAmountOut}
                          />
                        )}
                        <Button
                          className="flex h-[42px] w-fit min-w-fit items-center gap-1 rounded-full border-1 border-buttonDisabled bg-transparent p-2 transition hover:border-buttonSecondary data-[hover]:bg-transparent"
                          disableAnimation
                          disableRipple
                          onPress={() => onOpenModal(MODAL_LIST.SELECT_TOKEN_OUT)}
                        >
                          <Image
                            width={20}
                            height={20}
                            className="min-h-[20px] min-w-[20px]"
                            src={tokenOutLogoSrc}
                            onError={() => setTokenOutLogoSrc(NOT_FOUND_TOKEN_LOGO_URL)}
                          />
                          <TitleT1 className="whitespace-nowrap">{tokenOutInfo?.symbol ?? "--"}</TitleT1>
                          <ArrowFilledDownIcon size={20} />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center justify-between gap-1">
                          <BodyB2 className="text-buttonSecondary">
                            {fractionalAmountOutUsd
                              ? "~$" + numberWithCommas(fractionalAmountOutUsd.toSignificant(6), false, 2)
                              : "--"}
                          </BodyB2>
                          {priceImpact && (
                            <BodyB2
                              data-tooltip-id="tooltip-price-impact"
                              className={
                                isPriceImpactVeryHigh
                                  ? "text-buttonRed"
                                  : isPriceImpactHigh
                                    ? "text-buttonYellow"
                                    : "text-buttonSecondary"
                              }
                            >
                              (
                              {priceImpact
                                ? priceImpact.lessThan(new Fraction(1, 100))
                                  ? "<0.01%"
                                  : `~${truncateValue(priceImpact.toSignificant(4), 2)}%`
                                : "--"}
                              )
                            </BodyB2>
                          )}
                        </div>
                        {fractionalAmountIn && fractionalAmountOut && priceImpact === undefined ? (
                          <div className="flex items-center gap-1">
                            <Icon icon="ph:warning" fontSize={16} color="#F44646" />
                            <TitleT4 className="text-buttonRed">Can&apos;t calculate price impact</TitleT4>
                          </div>
                        ) : isPriceImpactVeryHigh ? (
                          <div className="flex items-center gap-1">
                            <Icon icon="ph:warning" fontSize={16} color="#F44646" />
                            <TitleT4 className="text-buttonRed">Price impact is very high</TitleT4>
                          </div>
                        ) : isPriceImpactHigh ? (
                          <div className="flex items-center gap-1">
                            <Icon icon="ph:warning" fontSize={16} color="#FF9901" />
                            <TitleT4 className="text-buttonYellow">Price impact is high</TitleT4>
                          </div>
                        ) : null}
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
                      onPress={() => onOpenModal(MODAL_LIST.TRADE_ROUTE)}
                    >
                      <BodyB2 className="whitespace-nowrap rounded border-1 border-primary p-2 text-primary">
                        {sourceInfo.numberOfPaths} split{sourceInfo.numberOfPaths >= 2 ? "s" : ""} &{" "}
                        {sourceInfo.numberOfPools} hop{sourceInfo.numberOfPools >= 2 ? "s" : ""}
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
                    className={
                      "h-[52px] rounded" +
                      " " +
                      ((fractionalAmountIn && fractionalAmountOut && !priceImpact) || isPriceImpactVeryHigh
                        ? "bg-buttonRed"
                        : "bg-primary")
                    }
                    isLoading={isSwapping}
                    onPress={onSwap}
                    isDisabled={swapButton.isDisabled}
                  >
                    <TitleT2>{swapButton.text}</TitleT2>
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="h-[52px] rounded"
                    onPress={() => onOpenModal(MODAL_LIST.CONNECT_WALLET)}
                    isLoading={isLoadingWallet}
                  >
                    <TitleT2>{isLoadingWallet ? "Loading Wallet" : "Connect Wallet"}</TitleT2>
                  </Button>
                )}

                <Spacer y={4} />

                {fractionalAmountIn && fractionalAmountOut && (
                  <>
                    <div className="flex flex-col gap-2 rounded-lg border-1 border-[rgba(128,134,139,0.5)] p-3">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
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
                              <BodyB2 className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {rate
                                  ? `1 ${tokenOutInfo?.symbol ?? "--"} = ${numberWithCommas(rate.invert().toSignificant(6))} ${tokenInInfo?.symbol ?? "--"}`
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
                              <BodyB2 className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {rate
                                  ? `1 ${tokenInInfo?.symbol ?? "--"} = ${numberWithCommas(rate.toSignificant(6))} ${tokenOutInfo?.symbol ?? "--"}`
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
                      </div>
                      <div className="flex items-center justify-between">
                        <BodyB2
                          className="border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
                          tabIndex={0}
                          data-tooltip-id="tooltip-minimum-received"
                        >
                          Minimum Received
                        </BodyB2>
                        {isValidatingQuote ? (
                          <>
                            <div className="flex h-[20px] w-[100px] items-center">
                              <Skeleton className="h-[20px] w-full rounded" />
                            </div>
                          </>
                        ) : (
                          <BodyB2>
                            {minimumReceived && tokenOutInfo
                              ? `${numberWithCommas(minimumReceived.toSignificant(6))} ${tokenOutInfo.symbol ?? "--"}`
                              : "--"}
                          </BodyB2>
                        )}
                      </div>
                    </div>
                    <Spacer y={4} />
                  </>
                )}

                {/* Comment chart for now. */}
                {/*
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Image width={20} height={20} className="min-h-[20px] min-w-[20px]" src={tokenInLogoSrc} />
                      <TitleT2 className="whitespace-nowrap">{tokenInInfo?.symbol ?? "--"}</TitleT2>
                    </div>
                    <Link
                      isBlock
                      showAnchorIcon
                      href={`https://aptoscan.com/coin/${tokenInInfo?.id}`}
                      color="primary"
                      className="p-0 text-buttonSecondary"
                      size="sm"
                      isExternal
                    >
                      <BodyB3 className="text-buttonSecondary">{`${tokenInInfo?.id.slice(0, 10)}...`}</BodyB3>
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
                      <TitleT2 className="whitespace-nowrap">{tokenOutInfo?.symbol ?? "--"}</TitleT2>
                    </div>
                    <Link
                      isBlock
                      showAnchorIcon
                      href={`https://aptoscan.com/coin/${tokenOutInfo?.id}`}
                      color="primary"
                      className="p-0 text-buttonSecondary"
                      size="sm"
                      isExternal
                    >
                      <BodyB3 className="text-buttonSecondary">{`${tokenOutInfo?.id.slice(0, 10)}...`}</BodyB3>
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
                */}
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
                <div className="flex items-center gap-2">
                  <BodyB2 className="text-buttonSecondary">© Anqa 2024</BodyB2>

                  <div className="flex items-center">
                    <Link
                      isBlock
                      href="https://x.com/anqa_apt"
                      color="primary"
                      className="text-buttonSecondary"
                      disableAnimation
                      size="sm"
                      isExternal
                    >
                      <Icon icon="mdi:twitter" fontSize={16} />
                    </Link>
                    <Link
                      isBlock
                      href="https://discord.gg/UR7fasRR"
                      color="primary"
                      className="text-buttonSecondary"
                      disableAnimation
                      size="sm"
                      isExternal
                    >
                      <Icon icon="ic:baseline-discord" fontSize={16} />
                    </Link>
                  </div>
                </div>

                {isSm ? (
                  <div />
                ) : (
                  <div className="flex items-center gap-5 md:gap-0">
                    <Link
                      isBlock
                      href="/docs/Terms_of_Use.pdf"
                      color="primary"
                      className="text-buttonSecondary"
                      size="sm"
                      isExternal
                      showAnchorIcon
                    >
                      <BodyB2>Terms & Conditions</BodyB2>
                    </Link>
                    <Link
                      isBlock
                      href="/docs/Privacy_and_Policy.pdf"
                      color="primary"
                      className="text-buttonSecondary"
                      size="sm"
                      isExternal
                      showAnchorIcon
                    >
                      <BodyB2>Privacy Policy</BodyB2>
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
        <ToastContainer
          autoClose={4000}
          draggablePercent={50}
          theme="dark"
          position="top-right"
          closeButton={false}
          pauseOnHover={false}
        />
        <ModalConnectWallet
          isOpen={globalModal === MODAL_LIST.CONNECT_WALLET && isModalOpen}
          onOpenChange={onOpenChangeModal}
          onClose={onCloseModal}
        />
        <ModalSelectToken
          isOpen={globalModal === MODAL_LIST.SELECT_TOKEN_IN && isModalOpen}
          onOpenChange={onOpenChangeModal}
          onClose={onCloseModal}
          setToken={setTokenIn}
        />
        <ModalSelectToken
          isOpen={globalModal === MODAL_LIST.SELECT_TOKEN_OUT && isModalOpen}
          onOpenChange={onOpenChangeModal}
          onClose={onCloseModal}
          setToken={setTokenOut}
        />
        <ModalUserSetting
          isOpen={globalModal === MODAL_LIST.USER_SETTING && isModalOpen}
          onOpenChange={onOpenChangeModal}
          onClose={onCloseModal}
        />
        {/* NOTE: Small view has bug, hide for now. */}
        {!isMd && (
          <ModalTradeRoute
            isOpen={globalModal === MODAL_LIST.TRADE_ROUTE && isModalOpen}
            onOpenChange={onOpenChangeModal}
            onClose={onCloseModal}
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            readableAmountIn={numberWithCommas(typedAmountIn)}
            readableAmountOut={readbleAmountOut}
            rawAmountIn={fractionalAmountIn?.numerator?.toString()}
            paths={paths}
          />
        )}
        <Tooltips />
      </div>
    </>
  )
}
