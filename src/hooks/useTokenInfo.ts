import axios from "axios"
import { useMemo } from "react"
import useSWR from "swr"
import { AGGREGATOR_URL } from "../constants"

export interface TokenInfo {
  id: string
  decimals: number
  name: string
  symbol: string
}

export interface GetTokenInfoResponseData {
  tokenById: Record<string, TokenInfo>
}

export interface GetTokenInfoResponse {
  code: number
  message: string
  data: GetTokenInfoResponseData
  requestId: string
}

const fn = async ({ tokens }: { key: string; tokens: string[] }) => {
  if (!tokens) return
  const url = `${AGGREGATOR_URL}/v1/tokens?` + tokens.map((t) => `ids[]=${t}`).join("&")
  const response = await axios<GetTokenInfoResponse>(url)
  if (response.status === 200) {
    return response.data
  }
  return undefined
}

export default function useTokenInfo(tokens: string[]) {
  const {
    data: response,
    error,
    isValidating,
  } = useSWR({ key: "useTokenInfo", tokens }, fn, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  })

  const res = useMemo(
    () => ({
      isValidating,
      error,
      tokenInfoMap: response?.data.tokenById,
    }),
    [error, isValidating, response?.data.tokenById],
  )

  return res
}
