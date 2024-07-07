import axios from "axios"
import { useMemo } from "react"
import useSWR from "swr"
import { AGGREGATOR_URL } from "../constants"

export interface GetRouteResponse {
  code: number
  message: string
  data: GetRouteResponseData
  requestId: string
}

export interface GetRouteResponseData {
  srcCoinType: string
  dstCoinType: string
  srcAmount: string
  dstAmount: string
  paths: GetRouteResponseDataPath[][]
}

export interface GetRouteResponseDataPath {
  poolId: string
  source: string
  sourceType: string
  srcCoinType: string
  dstCoinType: string
  srcAmount: string
  dstAmount: string
  metadata: {
    isXToY?: boolean
    isStable?: boolean
    tokenInIndex?: number
    tokenOutIndex?: number
    marketId?: number
    tokenInWeight?: number
    tokenOutWeight?: number
  }
}

const fn = async ({
  tokenIn,
  tokenOut,
  amountIn,
  includeSources,
}: {
  key: string
  tokenIn?: string
  tokenOut?: string
  amountIn?: string
  includeSources?: string
}) => {
  if (!tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) == 0) return
  const excludeSources = ["bapt_swap_v1", "bapt_swap_v2", "bapt_swap_v2.1"]
  const response = await axios<GetRouteResponse>(`${AGGREGATOR_URL}/v1/quote`, {
    params: {
      srcCoinType: tokenIn,
      dstCoinType: tokenOut,
      amount: amountIn,
      includeSources,
      excludeSources: excludeSources.join(","),
    },
  })
  if (response.status === 200 && response.data.data.dstAmount != "0") {
    return response.data
  }
  return undefined
}

// const swrOptions =
//   import.meta.env.MODE === "development"
//     ? {
//         refreshInterval: 0,
//         revalidateIfStale: false,
//         revalidateOnFocus: false,
//         revalidateOnMount: false,
//         revalidateOnReconnect: false,
//       }
//     : { refreshInterval: 10_000 }

export default function useQuote(tokenIn?: string, tokenOut?: string, amountIn?: string, includeSources?: string) {
  const {
    data: response,
    error,
    isValidating,
    mutate,
  } = useSWR({ key: "useQuote", tokenIn, tokenOut, amountIn, includeSources }, fn)

  const sourceInfo = useMemo(() => {
    if (!response?.data.paths) return undefined
    let numberOfPools = 0
    for (let i = 0; i < response.data.paths.length; i++) {
      for (let j = 0; j < response.data.paths[i].length; j++) {
        numberOfPools++
      }
    }
    return {
      numberOfPaths: response.data.paths.length,
      numberOfPools: numberOfPools,
    }
  }, [response?.data.paths])

  const res = useMemo(
    () => ({
      isValidating,
      error,
      amountOut: response?.data.dstAmount,
      paths: response?.data.paths,
      sourceInfo,
      reFetch: mutate,
    }),
    [error, isValidating, mutate, response?.data.dstAmount, response?.data.paths, sourceInfo],
  )

  return res
}
