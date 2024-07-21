import { SwapArgs, getSwapDataFromArgs } from "@anqa-ag/ts-sdk"
import { isUserTransactionResponse } from "@aptos-labs/ts-sdk"
import { useCallback, useMemo, useState } from "react"
import { aptos } from "../utils/aptos"
import useAnqaWallet from "./useAnqaWallet"
import useRefreshBalanceFn from "./useRefreshBalanceFn"
import useSwapNotificationFn from "./useSwapNotificationFn"

export interface SwapState {
  isSwapping: boolean
  txVersion: string | undefined
  success: boolean | undefined
}

export default function useSwap() {
  const [{ isSwapping, txVersion, success }, setSwapState] = useState<SwapState>({
    isSwapping: false,
    txVersion: undefined,
    success: undefined,
  })
  const { signAndSubmitTransaction, account, connected, isTelegram } = useAnqaWallet()

  const sendNotification = useSwapNotificationFn()
  const refreshBalance = useRefreshBalanceFn()

  const onSwap = useCallback(
    async (args: SwapArgs) => {
      if (!account || !connected || isSwapping) return

      try {
        setSwapState({ isSwapping: true, txVersion: undefined, success: undefined })

        const swapData = getSwapDataFromArgs(args)
        // const swapData = await getSwapData({
        //   amountIn: args.amountIn,
        //   chargeFeeBy: args.chargeFeeBy,
        //   feeBps: args.feeBps,
        //   feeRecipient: args.feeRecipient,
        //   slippageBps: 5000,
        //   tokenIn: args.tokenIn,
        //   tokenOut: args.tokenOut,
        // })

        if (isTelegram) {
          await signAndSubmitTransaction(
            btoa(
              JSON.stringify({
                function: swapData.function,
                arguments: swapData.functionArguments,
                type_arguments: swapData.typeArguments,
              }),
            ) as any,
          )
          return
        }

        const response: {
          hash: string
          output: Record<string, any>
        } = await signAndSubmitTransaction({ sender: account.address, data: swapData })
        console.log(`response`, response)
        if (
          response.hash &&
          (response.output === undefined || Object.keys(response.output).length === 0 || !response.output.version)
        ) {
          const aptosResponse = await aptos.waitForTransaction({
            transactionHash: response.hash,
            options: { checkSuccess: false, timeoutSecs: 2, waitForIndexer: true },
          })
          console.log(`aptosResponse`, aptosResponse)
          if (isUserTransactionResponse(aptosResponse)) {
            response.output = aptosResponse
          } else {
            throw new Error(`Something is wrong. aptosResponse = ${JSON.stringify(aptosResponse, null, 4)}`)
          }
        }
        setSwapState({ isSwapping: false, txVersion: response.output?.version, success: response.output?.success })
        sendNotification(
          args.tokenIn,
          args.tokenOut,
          args.amountIn,
          args.amountOut,
          response.output?.version,
          Boolean(response.output?.success),
          response.output?.vm_status,
        )
        void refreshBalance()
      } catch (err) {
        console.error(err)
        setSwapState((prev) => ({ ...prev, isSwapping: false }))

        const jsonErr = JSON.stringify(err)
        const isUserRejectError = jsonErr.toLowerCase().includes("user") && jsonErr.toLowerCase().includes("request")
        if (!isUserRejectError) {
          let errorDetails: string | undefined = undefined
          if (typeof err === "string") {
            errorDetails = err
          } else {
            errorDetails = (err as any)?.message || undefined
          }
          sendNotification(args.tokenIn, args.tokenOut, args.amountIn, args.amountOut, undefined, false, errorDetails)
        }
      }
    },
    [account, connected, isSwapping, isTelegram, refreshBalance, sendNotification, signAndSubmitTransaction],
  )

  const res = useMemo(
    () => ({
      isSwapping,
      txVersion,
      success,
      onSwap,
    }),
    [isSwapping, onSwap, success, txVersion],
  )
  return res
}
