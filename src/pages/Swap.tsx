import { APTOS_COIN } from '@aptos-labs/ts-sdk'
import { Icon } from '@iconify/react'
import { Button, Image, Skeleton, Spacer } from '@nextui-org/react'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useDebounceValue } from 'usehooks-ts'
import { ArrowFilledDownIcon, ChevronRight, SettingIcon, SwapIcon, WalletIcon } from '../components/Icons.tsx'
import { BodyB2, TitleT1, TitleT2, TitleT4 } from '../components/Texts.tsx'
import ModalSelectToken from '../components/modals/ModalSelectToken.tsx'
import ModalTradeRoute from '../components/modals/ModalTradeRoute.tsx'
import ModalUserSetting from '../components/modals/ModalUserSetting.tsx'
import { BIP_BASE, NOT_FOUND_TOKEN_LOGO_URL, petraWallet, USDC } from '../constants'
import { SUPPORTED_POOLS } from '../constants/pool.ts'
import { SwapContext } from '../contexts/SwapContext.ts'
import useAnqaWallet from '../hooks/useAnqaWallet.ts'
import useFullTokens from '../hooks/useFullTokens.ts'
import useModal, { MODAL_LIST } from '../hooks/useModal.ts'
import useQuote from '../hooks/useQuote.ts'
import useSwap from '../hooks/useSwap.tsx'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { addTokensToFollow, Asset } from '../redux/slices/asset.ts'
import { Fraction } from '../utils/fraction.ts'
import {
  divpowToFraction,
  escapeRegExp,
  inputRegex,
  mulpowToFraction,
  numberWithCommas,
  truncateValue,
} from '../utils/number.ts'
import CountdownSpinner from '../components/CountdownSpinner.tsx'
import AppLayout from '../AppLayout.tsx'
import { ChargeFeeBy } from '@anqa-ag/ts-sdk'
import { Helmet } from 'react-helmet'
import { useTokenBalance } from '../hooks/useRefreshBalanceFn.ts'
import ModalConnectWallet from '../components/modals/ModalConnectWallet.tsx'

export default function Swap() {
  const dispatch = useAppDispatch()

  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const isDebug = useMemo(() => params.get('debug') === 'true', [params])
  const [debugData, setDebugData] = useState<{
    sources: string
    feeRecipient: string
    feeBps: number
    chargeFeeBy: ChargeFeeBy
  }>({
    sources: '',
    feeRecipient: '0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3',
    feeBps: 0,
    chargeFeeBy: 'token_in',
  })

  const resetTimerFunction = useRef(() => {})
  const { setSwapLocation } = useContext(SwapContext)

  const setResetTimerFunc = (f: () => void) => (resetTimerFunction.current = f)

  const [_tokenInInfo, setTokenInInfo] = useState<Asset>()
  const [_tokenOutInfo, setTokenOutInfo] = useState<Asset>()
  const { account, isLoading: isLoadingWallet, isTelegram, connect } = useAnqaWallet()

  const [typedAmountIn, _setTypedAmountIn] = useState('1')
  const [shouldUseDebounceAmountIn, setShouldUseDebounceAmountIn] = useState(true)
  const setTypedAmountIn = useCallback((value: string, decimals = 8, shouldUseDebounce = true) => {
    setShouldUseDebounceAmountIn(shouldUseDebounce)
    if (value?.endsWith(',')) {
      value = value.slice(0, value.length - 1) + '.'
    }
    value = value.replaceAll(',', '')
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      value = truncateValue(value, decimals)
      if (value.length && value.startsWith('.')) value = '0.'
      value = numberWithCommas(value)
      _setTypedAmountIn(value)
    }
  }, [])

  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
  const tokenIn = useMemo(
    () =>
      (Object.values(followingTokenData) as Asset[]).find((token) => {
        try {
          const tokenSymbolOrAddress = location.pathname.replace('/swap/', '').split('-')[0]
          return token.symbol === tokenSymbolOrAddress || token.id === tokenSymbolOrAddress
        } catch {
          return false
        }
      })?.id || APTOS_COIN,
    [followingTokenData, location.pathname],
  )
  const tokenOut = useMemo(
    () =>
      (Object.values(followingTokenData) as Asset[]).find((token) => {
        try {
          const tokenSymbolOrAddress = location.pathname.replace('/swap/', '').split('-')[1]
          return token.symbol === tokenSymbolOrAddress || token.id === tokenSymbolOrAddress
        } catch {
          return false
        }
      })?.id || USDC,
    [followingTokenData, location.pathname],
  )
  const tokenInInfo: Asset | undefined = useMemo(() => {
    return _tokenInInfo || followingTokenData[tokenIn]
  }, [followingTokenData, tokenIn, _tokenInInfo])
  const tokenOutInfo: Asset | undefined = useMemo(
    () => _tokenOutInfo || followingTokenData[tokenOut],
    [followingTokenData, tokenOut, _tokenOutInfo],
  )

  const { data: fullTokenData } = useFullTokens()
  useEffect(() => {
    const pair = location.pathname.replace('/swap/', '')
    try {
      const tokenInSymbolOrAddress = pair.split('-')[0]
      const tokenOutSymbolOrAddress = pair.split('-')[1]
      if (!tokenInSymbolOrAddress || !tokenOutSymbolOrAddress) throw new Error(`invalid pair = ${pair}`)

      const followingTokenDataList = Object.values(followingTokenData) as Asset[]

      if (!fullTokenData || Object.values(fullTokenData).length === 0) return
      const fullTokenDataList = Object.values(fullTokenData) as Asset[]

      const newTokenIn =
        fullTokenDataList.find((token) => token.id === tokenInSymbolOrAddress) ||
        followingTokenDataList.find((token) => token.symbol === tokenInSymbolOrAddress)
      const newTokenOut =
        fullTokenDataList.find((token) => token.id === tokenOutSymbolOrAddress) ||
        followingTokenDataList.find((token) => token.symbol === tokenOutSymbolOrAddress)
      if (!newTokenIn) throw new Error(`cannot find tokenIn = ${tokenInSymbolOrAddress}`)
      if (!newTokenOut) throw new Error(`cannot find tokenOut = ${tokenOutSymbolOrAddress}`)
      dispatch(addTokensToFollow([newTokenIn.id, newTokenOut.id]))
    } catch (err) {
      pair !== '/swap' && console.error(err)
      navigate(`/swap/APT-USDC?${params.toString()}`, { replace: true })
    }
  }, [dispatch, followingTokenData, fullTokenData, location.pathname, navigate, params])

  const _setTokenIn = useCallback(
    (symbolOrAddress: string) => {
      const pair = location.pathname.replace('/swap/', '')
      try {
        const tokenInSymbolOrAddress = pair.split('-')[0]
        const tokenOutSymbolOrAddress = pair.split('-')[1]
        if (!tokenInSymbolOrAddress || !tokenOutSymbolOrAddress) throw new Error(`invalid pair = ${pair}`)
        navigate(`/swap/${symbolOrAddress}-${tokenOutSymbolOrAddress}?${params.toString()}`, { replace: true })
      } catch (err) {
        pair !== '/swap' && console.error(err)
        navigate(`/swap/APT-USDC?${params.toString()}`, {
          replace: true,
        })
      }
    },
    [location.pathname, navigate, params],
  )
  const _setTokenOut = useCallback(
    (symbolOrAddress: string) => {
      const pair = location.pathname.replace('/swap/', '')
      try {
        const tokenInSymbolOrAddress = pair.split('-')[0]
        const tokenOutSymbolOrAddress = pair.split('-')[1]
        if (!tokenInSymbolOrAddress || !tokenOutSymbolOrAddress) throw new Error(`invalid pair = ${pair}`)
        navigate(`/swap/${tokenInSymbolOrAddress}-${symbolOrAddress}?${params.toString()}`, { replace: true })
      } catch (err) {
        pair !== '/swap' && console.error(err)
        navigate(`/swap/APT-USDC?${params.toString()}`, {
          replace: true,
        })
      }
    },
    [location.pathname, navigate, params],
  )

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

  const balanceTokenIn = useTokenBalance(tokenInInfo)
  const fractionalBalanceTokenIn = useMemo(
    () =>
      balanceTokenIn && tokenInDecimals !== undefined ? divpowToFraction(balanceTokenIn, tokenInDecimals) : undefined,
    [balanceTokenIn, tokenInDecimals],
  )
  const balanceTokenOut = useTokenBalance(tokenOutInfo)
  const fractionalBalanceTokenOut = useMemo(
    () =>
      balanceTokenOut && tokenOutDecimals !== undefined
        ? divpowToFraction(balanceTokenOut, tokenOutDecimals)
        : undefined,
    [balanceTokenOut, tokenOutDecimals],
  )

  const _fractionalAmountIn = useMemo(
    () =>
      typedAmountIn && tokenInDecimals !== undefined
        ? mulpowToFraction(typedAmountIn.replaceAll(',', ''), tokenInDecimals)
        : undefined,
    [tokenInDecimals, typedAmountIn],
  )
  const [fractionalAmountIn] = useDebounceValue(_fractionalAmountIn, shouldUseDebounceAmountIn ? 250 : 0)
  const { txVersion: swapTxVersion, isSwapping, onSwap: _onSwap, success: isSwapSuccess } = useSwap()
  const slippageBps = useAppSelector((state) => state.user.slippageBps)
  const isHighSlippage = slippageBps >= 500

  const {
    dstAmount: amountOut,
    isValidating: isValidatingQuote,
    paths,
    sourceInfo,
    swapData,
    reFetch,
  } = useQuote({
    isSwapping,
    sender: account?.address,
    receiver: account?.address,
    srcAsset: tokenIn,
    dstAsset: tokenOut,
    srcAmount: fractionalAmountIn?.numerator?.toString(),
    slippageBps,
    includeSources: debugData.sources,
    feeBps: debugData.feeBps,
    chargeFeeBy: debugData.chargeFeeBy,
    feeReceiver: debugData.feeRecipient,
  })
  const fractionalAmountOut = useMemo(
    () =>
      amountOut && tokenOutDecimals != undefined ? new Fraction(amountOut, Math.pow(10, tokenOutDecimals)) : undefined,
    [tokenOutDecimals, amountOut],
  )

  const readableAmountOut =
    fractionalAmountOut && tokenOutDecimals !== undefined
      ? numberWithCommas(truncateValue(fractionalAmountOut.toFixed(18), tokenOutDecimals))
      : ''

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

  const minimumReceived = useMemo(() => {
    if (!fractionalAmountOut) return undefined
    // If any tokens have more than 8 decimals, this assignment will break. I assume 8 is the max decimals in aptos chain? Never mind, I will use 18.
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
        setTypedAmountIn('', tokenInDecimals, false)
      }
    } else {
      setTypedAmountIn('', tokenInDecimals, false)
    }
  }

  const swapButton = useMemo(() => {
    if (!fractionalAmountIn) return { isDisabled: true, text: 'Enter an amount' }
    if (!isSufficientBalance) return { isDisabled: true, text: 'Insufficient balance' }
    if (isValidatingQuote) return { isDisabled: true, text: 'Getting quote...' }
    if (!fractionalAmountOut) return { isDisabled: true, text: 'Not found route' }
    return { isDisabled: false, text: 'Swap' }
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
      setTypedAmountIn('')
    }
    const pair = location.pathname.replace('/swap/', '')
    try {
      const tokenInSymbolOrAddress = pair.split('-')[0]
      const tokenOutSymbolOrAddress = pair.split('-')[1]
      if (!tokenInSymbolOrAddress || !tokenOutSymbolOrAddress) throw new Error(`invalid pair = ${pair}`)
      navigate(`/swap/${tokenOutSymbolOrAddress}-${tokenInSymbolOrAddress}?${params.toString()}`, { replace: true })
    } catch (err) {
      pair !== '/swap' && console.error(err)
      navigate(`/swap/APT-USDC?${params.toString()}`, { replace: true })
    }
    setTokenInInfo(_tokenOutInfo)
    setTokenOutInfo(_tokenInInfo)
  }, [
    fractionalAmountOut,
    location.pathname,
    _tokenInInfo,
    _tokenOutInfo,
    navigate,
    params,
    setTypedAmountIn,
    tokenOutDecimals,
  ])
  const { globalModal, isModalOpen, onOpenModal, onCloseModal, onOpenChangeModal } = useModal()

  const setTokenIn = useCallback(
    (token: Asset) => {
      setTokenInInfo(token)
      const symbolOrAddress = token.whitelisted ? token.symbol : token.id
      if (tokenOut === symbolOrAddress || (tokenOutInfo && tokenOutInfo.symbol === symbolOrAddress)) {
        switchToken()
      } else {
        _setTokenIn(symbolOrAddress)
      }
      onCloseModal()
    },
    [_setTokenIn, onCloseModal, switchToken, tokenOut, tokenOutInfo],
  )
  const setTokenOut = useCallback(
    (token: Asset) => {
      setTokenOutInfo(token)
      const symbolOrAddress = token.whitelisted ? token.symbol : token.id
      if (tokenIn === symbolOrAddress || (tokenInInfo && tokenInInfo.symbol === symbolOrAddress)) {
        switchToken()
      } else {
        _setTokenOut(symbolOrAddress)
      }
      onCloseModal()
    },
    [onCloseModal, _setTokenOut, switchToken, tokenIn, tokenInInfo],
  )

  const onSwap = () => {
    if (fractionalAmountIn && fractionalAmountOut && minimumReceived && paths && swapData) {
      void _onSwap({
        tokenIn,
        tokenOut,
        amountIn: fractionalAmountIn.numerator.toString(),
        amountOut: fractionalAmountOut.numerator.toString(),
        swapData,
      })
    }
  }

  useEffect(() => {
    resetTimerFunction.current()
  }, [fractionalAmountIn, tokenIn, tokenOut, isValidatingQuote])

  useEffect(() => {
    setSwapLocation?.(location.pathname)
  }, [setSwapLocation, location])

  return (
    <AppLayout>
      <Helmet>
        <title>Swap | Anqa</title>
      </Helmet>
      {isDebug && (
        <div className="absolute left-0 top-1/2 w-[250px] -translate-y-1/2 border-1 border-red-500 p-4">
          <div>💡 Press cmd and click to multiple select source.</div>
          <a
            href={`https://aptoscan.com/transaction/${swapTxVersion}`}
            target="_blank"
            rel="noreferrer"
            className="break-all"
          >
            tx_version: {swapTxVersion ? `https://aptoscan.com/transaction/${swapTxVersion}` : '--'}
          </a>
          <div>tx_success: {isSwapSuccess === undefined ? '--' : isSwapSuccess ? 'true' : 'false'}</div>
          <div>
            <select
              className="h-[50vh] border-1 border-red-500"
              onChange={(e) =>
                setDebugData((prev) => ({
                  ...prev,
                  sources: [...e.currentTarget.options]
                    .filter((op) => op.selected)
                    .map((op) => op.value)
                    .join(','),
                }))
              }
              multiple
            >
              {Object.keys(SUPPORTED_POOLS).map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>
          </div>
          <div>fee in bps(0-10000)</div>
          <NumericFormat
            min={0}
            max={10000}
            value={debugData.feeBps}
            onChange={(e) =>
              setDebugData((prev) => ({
                ...prev,
                feeBps: Number(e.currentTarget.value),
              }))
            }
          />
          <div>fee recipient</div>
          <input
            value={debugData.feeRecipient}
            onChange={(e) =>
              setDebugData((prev) => ({
                ...prev,
                feeRecipient: e.currentTarget.value,
              }))
            }
          />
          <div>charge fee by</div>
          <div>
            <select
              className="border-1 border-red-500"
              value={debugData.chargeFeeBy}
              onChange={(e) =>
                setDebugData((prev) => ({
                  ...prev,
                  chargeFeeBy: e.currentTarget.value as ChargeFeeBy,
                }))
              }
            >
              {['token_in', 'token_out'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <main className="mt-[60px] w-full p-4 sm:mt-0">
        <div className="mx-auto flex max-w-[464px] flex-col">
          <div className="flex justify-end gap-2">
            <Button
              isIconOnly
              className={'h-[36px] w-[36px] min-w-min rounded border-1 border-black600 bg-black'}
              disableAnimation
              onPress={async () => {
                if (!isValidatingQuote) await reFetch()
              }}
            >
              <CountdownSpinner
                timeInSeconds={10}
                onFinishCountdown={reFetch}
                setResetTimerFunc={setResetTimerFunc}
                isLoading={isValidatingQuote}
                size={20}
              />
            </Button>
            <Button
              isIconOnly
              className={
                'h-[36px] w-[36px] min-w-min rounded border-1 border-black600 pl-3' +
                ' ' +
                (isHighSlippage ? 'bg-[rgba(255,153,1,0.2)]' : 'bg-black')
              }
              onPress={() => onOpenModal(MODAL_LIST.USER_SETTING)}
              disableAnimation
            >
              <BodyB2 className={isHighSlippage ? 'text-[rgba(255,153,1)]' : 'text-buttonSecondary'}>
                {slippageBps / 100}%
              </BodyB2>
              <SettingIcon size={36} color={isHighSlippage ? 'rgba(255,153,1)' : '#9AA0A6'} />
            </Button>
          </div>

          <Spacer y={4} />

          <div className="relative flex flex-col gap-1">
            {/* INPUT */}
            <>
              <div className="flex flex-col gap-2 rounded border-1 border-black900 bg-black900 p-3 transition focus-within:border-black600">
                <div className="flex h-[24px] items-center justify-between">
                  <BodyB2 className="text-buttonSecondary">You&apos;re paying</BodyB2>
                  {account && (
                    <Button
                      className="anqa-hover-white-all flex h-fit w-fit min-w-fit items-center gap-1 bg-transparent p-0"
                      disableAnimation
                      disableRipple
                      onClick={() => onSetPercentAmountIn(100)}
                    >
                      <WalletIcon size={24} />
                      <BodyB2 className="text-buttonSecondary">
                        {fractionalBalanceTokenIn ? numberWithCommas(fractionalBalanceTokenIn.toSignificant(6)) : '0'}
                      </BodyB2>
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <NumericFormat
                    decimalSeparator="."
                    allowedDecimalSeparators={[',']}
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
                    allowNegative={false}
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
                    <TitleT1 className="whitespace-nowrap">
                      {tokenInInfo?.displaySymbol ?? tokenInInfo?.symbol ?? '--'}
                    </TitleT1>
                    <ArrowFilledDownIcon size={20} />
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <BodyB2 className="text-buttonSecondary">
                    {fractionalAmountInUsd
                      ? '~$' + numberWithCommas(fractionalAmountInUsd.toSignificant(6), false, 2)
                      : '--'}
                  </BodyB2>
                  <div className="flex gap-1 overflow-hidden">
                    <Button
                      className="anqa-hover-white-all h-fit w-fit min-w-fit rounded bg-black600 px-3 text-buttonSecondary"
                      disableRipple
                      onClick={() => onSetPercentAmountIn(25)}
                    >
                      25%
                    </Button>
                    <Button
                      className="anqa-hover-white-all h-fit w-fit min-w-fit rounded bg-black600 px-3 text-buttonSecondary"
                      disableRipple
                      onClick={() => onSetPercentAmountIn(50)}
                    >
                      50%
                    </Button>
                    <Button
                      className="anqa-hover-white-all h-fit w-fit min-w-fit rounded bg-black600 px-3 text-buttonSecondary"
                      disableRipple
                      onClick={() => onSetPercentAmountIn(75)}
                    >
                      75%
                    </Button>
                    <Button
                      className="anqa-hover-white-all h-fit w-fit min-w-fit rounded bg-black600 px-3 text-buttonSecondary"
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
                  {account && (
                    <Button
                      className="flex h-fit w-fit min-w-fit items-center gap-1 bg-transparent p-0 data-[hover]:opacity-100"
                      disableAnimation
                      disableRipple
                      disabled
                    >
                      <WalletIcon size={24} />
                      <BodyB2 className="text-buttonSecondary">
                        {fractionalBalanceTokenOut ? numberWithCommas(fractionalBalanceTokenOut.toSignificant(6)) : '0'}
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
                      decimalSeparator="."
                      allowedDecimalSeparators={[',']}
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
                      value={readableAmountOut}
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
                    <TitleT1 className="whitespace-nowrap">
                      {tokenOutInfo?.displaySymbol ?? tokenOutInfo?.symbol ?? '--'}
                    </TitleT1>
                    <ArrowFilledDownIcon size={20} />
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center justify-between gap-1">
                    <BodyB2 className="text-buttonSecondary">
                      {fractionalAmountOutUsd
                        ? '~$' + numberWithCommas(fractionalAmountOutUsd.toSignificant(6), false, 2)
                        : '--'}
                    </BodyB2>
                    {priceImpact && priceImpact.greaterThan(new Fraction(1, 100)) && (
                      <BodyB2
                        data-tooltip-id="tooltip-price-impact"
                        className={
                          isPriceImpactVeryHigh
                            ? 'text-buttonRed'
                            : isPriceImpactHigh
                              ? 'text-buttonYellow'
                              : 'text-buttonSecondary'
                        }
                      >
                        ({`-${truncateValue(priceImpact.toSignificant(4), 2)}%`})
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

          <Spacer y={4} />

          {account ? (
            <Button
              className={
                'h-[52px] rounded' +
                ' ' +
                ((fractionalAmountIn && fractionalAmountOut && !priceImpact) || isPriceImpactVeryHigh
                  ? 'bg-buttonRed'
                  : 'bg-primary')
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
              onPress={() => (isTelegram ? connect(petraWallet.name) : onOpenModal(MODAL_LIST.CONNECT_WALLET))}
              isLoading={isLoadingWallet}
            >
              <TitleT2>{isLoadingWallet ? 'Loading Wallet' : 'Connect Wallet'}</TitleT2>
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
                        className="m-0 h-fit gap-1 p-0 data-[hover]:bg-transparent"
                        disableAnimation
                        disableRipple
                      >
                        <BodyB2 className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {rate
                            ? `1 ${tokenOutInfo?.symbol ?? '--'} = ${numberWithCommas(rate.invert().toSignificant(6))} ${tokenInInfo?.displaySymbol ?? tokenInInfo?.symbol ?? '--'}`
                            : '--'}
                        </BodyB2>
                        <SwapIcon size={16} color="#FFFFFF" className="rotate-90" />
                      </Button>
                    ) : (
                      <Button
                        onPress={() => setIsInvert((prev) => !prev)}
                        variant="light"
                        className="m-0 h-fit gap-1 p-0 data-[hover]:bg-transparent"
                        disableAnimation
                        disableRipple
                      >
                        <BodyB2 className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {rate
                            ? `1 ${tokenInInfo?.displaySymbol ?? tokenInInfo?.symbol ?? '--'} = ${numberWithCommas(rate.toSignificant(6))} ${tokenOutInfo?.displaySymbol ?? tokenOutInfo?.symbol ?? '--'}`
                            : '--'}
                        </BodyB2>
                        <SwapIcon size={16} color="#FFFFFF" className="rotate-90" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <BodyB2 className="cursor-pointer text-buttonSecondary">Minimum Received</BodyB2>
                    <Button
                      isIconOnly
                      variant="light"
                      className="h-fit min-h-fit w-fit min-w-fit"
                      disabled
                      disableAnimation
                    >
                      <Icon
                        icon="material-symbols:info-outline"
                        color="#9AA0A6"
                        tabIndex={0}
                        data-tooltip-id="tooltip-minimum-received"
                      />
                    </Button>
                  </div>
                  {isValidatingQuote ? (
                    <>
                      <div className="flex h-[20px] w-[100px] items-center">
                        <Skeleton className="h-[20px] w-full rounded" />
                      </div>
                    </>
                  ) : (
                    <BodyB2>
                      {minimumReceived && tokenOutInfo
                        ? `${numberWithCommas(minimumReceived.toSignificant(6))} ${tokenOutInfo.displaySymbol ?? tokenOutInfo.symbol ?? '--'}`
                        : '--'}
                    </BodyB2>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <BodyB2 className="text-buttonSecondary">Trade Route</BodyB2>
                  {isValidatingQuote ? (
                    <>
                      <div className="flex h-[20px] w-[100px] items-center">
                        <Skeleton className="h-[20px] w-full rounded" />
                      </div>
                    </>
                  ) : sourceInfo ? (
                    <Button
                      className="m-0 flex h-fit w-fit items-center gap-1 p-0 text-white data-[hover]:bg-transparent"
                      disableAnimation
                      variant="light"
                      onPress={() => onOpenModal(MODAL_LIST.TRADE_ROUTE)}
                    >
                      <BodyB2>
                        {sourceInfo.numberOfPaths} split
                        {sourceInfo.numberOfPaths >= 2 ? 's' : ''} & {sourceInfo.numberOfPools} hop
                        {sourceInfo.numberOfPools >= 2 ? 's' : ''}
                      </BodyB2>
                      <ChevronRight size={16} color="#ffffff" />
                    </Button>
                  ) : (
                    <BodyB2>--</BodyB2>
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
      <ToastContainer
        autoClose={4000}
        draggablePercent={50}
        theme="dark"
        position="top-right"
        closeButton={false}
        pauseOnHover={false}
      />
      <ModalSelectToken
        isOpen={globalModal === MODAL_LIST.SELECT_TOKEN_IN && isModalOpen}
        onOpenChange={onOpenChangeModal}
        onClose={onCloseModal}
        onSelectToken={setTokenIn}
      />
      <ModalConnectWallet
        isOpen={globalModal === MODAL_LIST.CONNECT_WALLET && isModalOpen}
        onOpenChange={onOpenChangeModal}
        onClose={onCloseModal}
      />
      <ModalSelectToken
        isOpen={globalModal === MODAL_LIST.SELECT_TOKEN_OUT && isModalOpen}
        onOpenChange={onOpenChangeModal}
        onClose={onCloseModal}
        onSelectToken={setTokenOut}
      />
      <ModalUserSetting
        isOpen={globalModal === MODAL_LIST.USER_SETTING && isModalOpen}
        onOpenChange={onOpenChangeModal}
        onClose={onCloseModal}
      />
      <ModalTradeRoute
        isOpen={globalModal === MODAL_LIST.TRADE_ROUTE && isModalOpen}
        onOpenChange={onOpenChangeModal}
        onClose={onCloseModal}
        srcCoinType={tokenIn}
        dstCoinType={tokenOut}
        readableAmountIn={numberWithCommas(typedAmountIn)}
        readableAmountOut={readableAmountOut}
        rawAmountIn={fractionalAmountIn?.numerator?.toString()}
        paths={paths}
      />
    </AppLayout>
  )
}
