import { isUserTransactionResponse } from "@aptos-labs/ts-sdk"
import { useCallback, useMemo, useState } from "react"
import { aptos } from "../utils/aptos"
import useAnqaWallet from "./useAnqaWallet"
import useSwapNotificationFn from "./useSwapNotificationFn"
import { SwapArgs, SwapState, getSwapDataFromPaths } from "../utils/swap"
import useRefreshBalanceFn from "./useRefreshBalanceFn"

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

      // const payload = {
      //   version: Date.now().toString(),
      //   isSuccess: true,
      //   tokenInSymbol: "APT",
      //   tokenOutSymbol: "zUSDC",
      //   readableAmountIn: Math.random().toFixed(6),
      //   readableAmountOut: Math.random().toFixed(6),
      //   isHide: false,
      // }
      // dispatch(addTransactionHistory(payload))
      // toast(
      //   payload.isSuccess ? (
      //     <div className="rounded bg-[rgba(24,207,106,0.2)] p-4">
      //       <TitleT2>
      //         Swap {payload.readableAmountIn} {payload.tokenInSymbol} to {payload.readableAmountOut} {payload.tokenOutSymbol}
      //       </TitleT2>
      //       <Link
      //         href={`https://aptoscan.com/transaction/${payload.version}`}
      //         isExternal
      //         showAnchorIcon
      //         className="text-buttonSecondary"
      //       >
      //         <TitleT4>View on explorer</TitleT4>
      //       </Link>
      //     </div>
      //   ) : (
      //     <div className="rounded bg-[rgba(244,70,70,0.2)] p-4">
      //       <TitleT2>
      //         Error swapping {payload.readableAmountIn} {payload.tokenInSymbol} to {payload.readableAmountOut}{" "}
      //         {payload.tokenOutSymbol}
      //       </TitleT2>
      //       <Link
      //         href={`https://aptoscan.com/transaction/${payload.version}`}
      //         isExternal
      //         showAnchorIcon
      //         className="text-buttonSecondary"
      //       >
      //         <TitleT4>View on explorer</TitleT4>
      //       </Link>
      //     </div>
      //   ),
      //   {
      //     className: "z-toast",
      //     bodyClassName: "z-toast-body",
      //     progressClassName: payload.isSuccess ? "z-toast-progress-success" : "z-toast-progress-failed",
      //   },
      // )
      // return

      try {
        setSwapState({ isSwapping: true, txVersion: undefined, success: undefined })
        // if (provider === "Petra") {
        //   if (!petra) return
        //   const swapData = getSwapDataFromPaths(args)
        //   const response = await petra.signAndSubmitTransaction({
        //     payload: {
        //       function: swapData.function,
        //       arguments: swapData.arguments,
        //       type_arguments: swapData.typeArguments,
        //     },
        //   })
        //   console.log(`response`, response)
        //   setSwapState({ isSwapping: false, txVersion: response.version, success: response.success })
        //   sendNotification(
        //     args.tokenIn,
        //     args.tokenOut,
        //     response.version,
        //     response.success,
        //     args.amountIn,
        //     args.amountOut,
        //   )
        // } else if (provider === "Martian") {
        //   if (!martian) return
        const swapData = getSwapDataFromPaths(args)

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
