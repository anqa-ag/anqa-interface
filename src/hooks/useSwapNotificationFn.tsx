import { Link } from '@nextui-org/react'
import { useCallback } from 'react'
import { isDesktop } from 'react-device-detect'
import { toast } from 'react-toastify'
import { BodyB2, TitleT2, TitleT4 } from '../components/Texts'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { addTransactionHistory, ITransactionHistory } from '../redux/slices/user'
import { divpowToFraction } from '../utils/number'
import useRefreshBalanceFn from './useRefreshBalanceFn.ts'

export default function useSwapNotificationFn() {
  const dispatch = useAppDispatch()
  const { followingTokenData } = useAppSelector((state) => state.token)

  const sendNotification = useCallback(
    (
      tokenIn: string,
      tokenOut: string,
      amountIn: string,
      amountOut: string,
      version: string | undefined,
      isSuccess: boolean,
      details: string | undefined,
    ) => {
      const tokenInData = followingTokenData[tokenIn]
      const tokenOutData = followingTokenData[tokenOut]
      if (tokenInData && tokenOutData) {
        const payload: ITransactionHistory = {
          version,
          isSuccess,
          details,
          tokenInSymbol: tokenInData.displaySymbol ?? tokenInData.symbol,
          tokenOutSymbol: tokenOutData.displaySymbol ?? tokenOutData.symbol,
          readableAmountIn: divpowToFraction(amountIn, tokenInData.decimals).toSignificant(6),
          readableAmountOut: divpowToFraction(amountOut, tokenOutData.decimals).toSignificant(6),
          timestamp: Date.now(),
          tokenInAddress: tokenInData.id,
          tokenOutAddress: tokenOutData.id,
        }
        dispatch(addTransactionHistory(payload))
        toast(
          payload.isSuccess ? (
            <div className="rounded bg-[rgba(24,207,106,0.2)] p-4">
              <TitleT2>
                Swap {payload.readableAmountIn} {payload.tokenInSymbol} to {payload.readableAmountOut}{' '}
                {payload.tokenOutSymbol}
              </TitleT2>
              {payload.version && (
                <Link
                  href={`https://aptoscan.com/transaction/${payload.version}`}
                  isExternal
                  showAnchorIcon
                  className="text-buttonSecondary"
                >
                  <TitleT4>View on explorer</TitleT4>
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded bg-[rgba(244,70,70,0.2)] p-4">
              <TitleT2>
                Error swapping {payload.readableAmountIn} {payload.tokenInSymbol} to {payload.readableAmountOut}{' '}
                {payload.tokenOutSymbol}
              </TitleT2>
              {payload.version && (
                <Link
                  href={`https://aptoscan.com/transaction/${payload.version}`}
                  isExternal
                  showAnchorIcon
                  className="text-buttonSecondary"
                >
                  <TitleT4>View on explorer</TitleT4>
                </Link>
              )}
              {details && <BodyB2>{details}</BodyB2>}
            </div>
          ),
          {
            className: 'z-toast',
            bodyClassName: 'z-toast-body',
            progressClassName: payload.isSuccess ? 'z-toast-progress-success' : 'z-toast-progress-failed',
            autoClose: payload.isSuccess || isDesktop ? 4000 : false,
            pauseOnHover: isDesktop,
          },
        )
      }
    },
    [dispatch, followingTokenData],
  )
  return sendNotification
}

const mapError: Record<string, string> = {
  'submitResponse.status REJECTED': 'User rejected transaction',
}
const formatError = (err: any) => {
  const jsonErr = JSON.stringify(err || {})
  if (jsonErr !== `{"code":"WALLET.SIGN_TX_ERROR"}`) {
    let errorDetails: string | undefined
    if (typeof err === 'string') {
      errorDetails = err
    } else {
      errorDetails = (err as any)?.message || undefined
    }

    return mapError[errorDetails ?? ''] || errorDetails
  }
  return ''
}

export const useShowToastWithExplorerLink = () => {
  const refreshBalance = useRefreshBalanceFn()
  return useCallback(
    ({
      isSuccess,
      txNumber,
      msg,
      error,
    }: {
      isSuccess: boolean
      msg: string
      txNumber?: string | undefined
      error?: any
    }) => {
      const details = formatError(error)
      toast(
        isSuccess ? (
          <div className="flex flex-col gap-2 rounded bg-[rgba(24,207,106,0.2)] p-4">
            <BodyB2>{msg}</BodyB2>
            {txNumber && (
              <Link
                href={`https://aptoscan.com/transaction/${txNumber}`}
                isExternal
                showAnchorIcon
                className="text-baseGrey"
              >
                <BodyB2>View on explorer</BodyB2>
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded bg-[rgba(244,70,70,0.2)] p-4">
            <BodyB2>{msg}</BodyB2>
            {txNumber && (
              <Link
                href={`https://aptoscan.com/transaction/${txNumber}`}
                isExternal
                showAnchorIcon
                className="text-baseGrey"
              >
                <BodyB2>View on explorer</BodyB2>
              </Link>
            )}
            {details && <BodyB2 className="text-baseGrey">{details}</BodyB2>}
          </div>
        ),
        {
          className: 'z-toast',
          bodyClassName: 'z-toast-body',
          progressClassName: isSuccess ? 'z-toast-progress-success' : 'z-toast-progress-failed',
          autoClose: 4000,
          pauseOnHover: isDesktop,
          position: 'top-right',
        },
      )
      setTimeout(() => {
        void refreshBalance()
      }, 4000)
    },
    [refreshBalance],
  )
}
