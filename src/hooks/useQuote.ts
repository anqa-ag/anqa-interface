import axios from "axios"
import { useMemo } from "react"
import useSWR from "swr"

export interface GetRouteResponse {
  code: number
  message: string
  data: GetRouteResponseData
  requestId: string
}

export interface GetRouteResponseData {
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
  paths: GetRouteResponseDataPath[][]
}

export interface GetRouteResponseDataPath {
  poolId: string
  source: string
  sourceType: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
}

const fn = async ({
  tokenIn,
  tokenOut,
  amountIn,
}: {
  key: string
  tokenIn?: string
  tokenOut?: string
  amountIn?: string
}) => {
  console.log('x', {
    tokenIn,
    tokenOut,
    amountIn,
  })
  if (!tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) == 0) return
  const response = await axios<GetRouteResponse>("https://apt-aggregator-api.tin-zin.com/v1/quote", {
    params: {
      tokenIn,
      tokenOut,
      amountIn,
    },
  })
  // console.log('y', {
  //   tokenIn,
  //   tokenOut,
  //   amountIn,
  // })
  if (response.status === 200) {
    return response.data
  }
  return undefined
}

export function sourceToName(source: string): string {
  const list: Record<string, string> = {
    pancake_swap: "PancakeSwap",
    sushi_swap: "SushiSwap",
    liquid_swap_v0: "LiquidSwap",
    "liquid_swap_v0.5": "LiquidSwap",
    thala_swap_stable: "ThalaSwap",
    thala_swap_weighted: "ThalaSwap",
    bapt_swap_v1: "BaptSwap",
    "bapt-swap_v2": "BaptSwap",
    "bapt_swap_v2.1": "BaptSwap",
    aux_exchange: "AuxExchange",
    cellana_finance: "CellanaFinance",
    cetus_amm: "Cetus",
    aptoswap: "Aptoswap",
  }
  if (list[source]) return list[source]
  return source
}

export default function useQuote(tokenIn?: string, tokenOut?: string, amountIn?: string) {
  const {
    data: response,
    error,
    isValidating,
  } = useSWR({ key: "useQuote", tokenIn, tokenOut, amountIn }, fn, {
    refreshInterval: 10000,
  })

  const sourceInfo = useMemo(() => {
    if (!response?.data.paths) return undefined
    const uniqueSourceNames = new Set()
    let numberOfPools = 0
    for (let i = 0; i < response.data.paths.length; i++) {
      for (let j = 0; j < response.data.paths[i].length; j++) {
        uniqueSourceNames.add(sourceToName(response.data.paths[i][j].source))
        numberOfPools++
      }
    }
    return {
      uniqueSourceNames: Array.from(uniqueSourceNames),
      numberOfPaths: response.data.paths.length,
      numberOfPools: numberOfPools,
    }
  }, [response?.data.paths])

  const res = useMemo(
    () => ({
      isValidating,
      error,
      amountOut: response?.data.amountOut,
      path: response?.data.paths,
      sourceInfo,
    }),
    [error, isValidating, response?.data.amountOut, response?.data.paths, sourceInfo],
  )

  return res
}
