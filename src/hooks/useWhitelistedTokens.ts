import axios from "axios"
import { useMemo } from "react"
import useSWR from "swr"

export interface RawCoinInfo {
  id: string
  decimals: number
  name: string
  symbol: string
  logoUrl: string
}

const fn = async () => {
  const url = "https://raw.githubusercontent.com/anqa-ag/aptos-coin-list/main/anqaTokenList.json"
  const response = await axios<RawCoinInfo[]>(url)
  if (response.status === 200) {
    return response.data
  }
  return undefined
}

export default function useWhitelistedTokens() {
  const { data } = useSWR("useWhitelistedTokens", fn)
  const res = useMemo(() => {
    if (!data) return undefined
    const m: Record<string, RawCoinInfo> = {}
    for (const token of data) {
      m[token.id] = token
    }
    return m
  }, [data])
  return res
}
