import axios from "axios"
import { useMemo } from "react"
import useSWR from "swr"

export interface GetTokenPriceResponse {
  code: number
  message: string
  data: GetTokenPriceResponseData
  requestId: string
}

export interface GetTokenPriceResponseData {
  priceById: Record<string, TokenPrice>
}

export interface TokenPrice {
  id: string
  price: number
  poolTvl: number
  poolId: string
  preferPoolId: string
  updatedAt: number
}

const fn = async ({ tokens }: { key: string; tokens: string[] }) => {
  if (!tokens) return
  const url = "https://apt-aggregator-api.tin-zin.com/v1/prices?" + tokens.map((t) => `ids[]=${t}`).join("&")
  const response = await axios<GetTokenPriceResponse>(url)
  if (response.status === 200) {
    return response.data
  }
  return undefined
}

export default function useTokenPrice(tokens: string[]) {
  const { data: response, error, isLoading } = useSWR({ key: "useTokenPrice", tokens }, fn)

  const res = useMemo(
    () => ({
      isLoading,
      error,
      tokenPriceMap: response?.data.priceById,
    }),
    [error, isLoading, response?.data.priceById],
  )

  return res
}
