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
  if (!tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) == 0) return
  const response = await axios<GetRouteResponse>("https://apt-aggregator-api.tin-zin.com/v1/quote", {
    params: {
      tokenIn,
      tokenOut,
      amountIn,
    },
  })
  if (response.status === 200) {
    return response.data
  }
  return undefined
}

export default function useQuote(tokenIn?: string, tokenOut?: string, amountIn?: string) {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR({ key: "useQuote", tokenIn, tokenOut, amountIn }, fn, {
    refreshInterval: 10000,
  })

  const res = useMemo(
    () => ({
      isLoading,
      error,
      amountOut: response?.data.amountOut,
      path: response?.data.paths,
    }),
    [error, isLoading, response?.data.amountOut, response?.data.paths],
  )

  return res
}
