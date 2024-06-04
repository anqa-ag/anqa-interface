import { useCallback, useMemo, useState } from "react"
import { petra } from "../../types"
import { useAppSelector } from "../redux/hooks"
import { GetRouteResponseDataPath } from "./useQuote"

enum TransactionStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

interface SwapState {
  isSwapping: boolean
  hash: string | undefined
  status: TransactionStatus | undefined
}

interface SwapArgs {
  tokenIn: string
  tokenOut: string
  amountIn: string // string of an integer
  amountOut: string // string of an integer
  minAmountOut: string // string of an integer
  paths: GetRouteResponseDataPath[][]
}

function getSwapDataFromPaths(args: SwapArgs): {
  function: string
  arguments: ((number | string)[] | string)[]
  typeArguments: string[]
} {
  console.log(`args`, args)
  const data = {
    function: "2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::swap",
    arguments: [
      [3, 3, 1, "10000000"],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      "0",
    ],
    typeArguments: [
      "0x1::aptos_coin::AptosCoin",
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
    ],
  }
  return data
}

export default function useSwap() {
  const [{ isSwapping, hash, status }, setSwapState] = useState<SwapState>({
    isSwapping: false,
    hash: undefined,
    status: undefined,
  })
  const { walletAddress, provider } = useAppSelector((state) => state.wallet)

  const onSwap = useCallback(async (args: SwapArgs) => {
    if (!provider || !walletAddress || isSwapping) return

    try {
      setSwapState({ isSwapping: true, hash: undefined, status: undefined })
      if (provider === "Petra") {
        if (!petra) return
        const swapData = getSwapDataFromPaths(args)
        const response = await petra.signAndSubmitTransaction({
          payload: {
            function: swapData.function,
            arguments: swapData.arguments,
            type_arguments: swapData.typeArguments,
          },
        })
        console.log(`response`, response)
      } else if (provider === "Martian") {
        throw new Error("Not support swap with Martian yet.")
      }
    } finally {
      setSwapState((prev) => ({ ...prev, isSwapping: false }))
    }
  }, [isSwapping, provider, walletAddress])

  const res = useMemo(
    () => ({
      isSwapping,
      hash,
      status,
      onSwap,
    }),
    [hash, isSwapping, onSwap, status],
  )
  return res
}

// const txxxxxxxx = await martian.generateTransaction(
//   "0x57b057e189f60ed079bbfe11b88b187cc6bea5016d1bc58aee5ec087f76ce44e",
//   transaction.data,
// )
