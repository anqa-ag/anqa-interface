import axios from "axios"
import { useMemo } from "react"
import useSWR from "swr"

export interface TokenType {
  type: string
  account_address: string
  module_name: string
  struct_name: string
}

export interface ExtensionType {
  data: [string, string][]
}

export interface RawCoinInfo {
  name: string
  symbol: string
  official_symbol: string
  coingecko_id: string
  decimals: number
  logo_url: string
  project_url: string
  token_type: TokenType
  extensions: ExtensionType
  unique_index: number
  source?: string
  hippo_symbol?: string
  pancake_symbol?: string
  permissioned_listing?: boolean
}

const fn = async () => {
  const url = "https://raw.githubusercontent.com/anqa-ag/aptos-coin-list/main/src/defaultList.mainnet.json"
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
      m[token.token_type.type] = token
    }
    return m
  }, [data])
  return res
}
