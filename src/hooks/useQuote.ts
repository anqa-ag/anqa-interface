import axios from "axios"
import { useMemo } from "react"
import useSWR from "swr"
import { AGGREGATOR_URL, BIP_BASE } from "../constants"

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
  amountInAfterFee,
  includeSources,
}: {
  key: string
  tokenIn?: string
  tokenOut?: string
  amountInAfterFee?: string
  includeSources?: string
}) => {
  if (!tokenIn || !tokenOut || !amountInAfterFee || parseFloat(amountInAfterFee) === 0) return
  const excludeSources = ["bapt_swap_v1", "bapt_swap_v2", "bapt_swap_v2.1"]
  const response = await axios<GetRouteResponse>(`${AGGREGATOR_URL}/v1/quote`, {
    params: {
      srcCoinType: tokenIn,
      dstCoinType: tokenOut,
      amount: amountInAfterFee,
      includeSources,
      excludeSources: excludeSources.join(","),
    },
  })
  if (response.status === 200 && response.data.data.dstAmount != "0") {
    return response.data
  }
  return undefined
}

export default function useQuote({
  tokenIn,
  tokenOut,
  amountIn,
  includeSources,
  feeBps,
  chargeFeeBy,
}: {
  tokenIn?: string
  tokenOut?: string
  amountIn?: string
  includeSources?: string
  feeBps?: number
  chargeFeeBy: "token_in" | "token_out"
}) {
  const amountInAfterFee = useMemo(
    () =>
      amountIn && feeBps && chargeFeeBy === "token_in"
        ? ((BigInt(amountIn) * BigInt(feeBps)) / BigInt(BIP_BASE)).toString()
        : amountIn,
    [amountIn, chargeFeeBy, feeBps],
  )
  const {
    data: response,
    error,
    isValidating,
    mutate,
  } = useSWR({ key: "useQuote", tokenIn, tokenOut, amountInAfterFee, includeSources }, fn)

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

  const amountOutAfterFee = useMemo(() => {
    const amountOut = response?.data.dstAmount
    if (!amountOut || !feeBps) return
    if (chargeFeeBy === "token_out") {
      const amountOutAfterFee = ((BigInt(amountOut) * BigInt(feeBps)) / BigInt(BIP_BASE)).toString()
      return amountOutAfterFee
    }
    return amountOut
  }, [chargeFeeBy, feeBps, response?.data.dstAmount])

  const res = useMemo(
    () => ({
      isValidating,
      error,
      amountOut: amountOutAfterFee,
      paths: response?.data.paths,
      sourceInfo,
      reFetch: mutate,
    }),
    [amountOutAfterFee, error, isValidating, mutate, response?.data.paths, sourceInfo],
  )

  return res
}
