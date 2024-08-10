import axios from 'axios'
import { memo, useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { AGGREGATOR_URL } from '../../constants'
import useFullTokens from '../../hooks/useFullTokens'
import { useAppDispatch, useAppSelector } from '../hooks'
import { Token, addTokensToFollow, updateTokenData } from '../slices/token'
import { PartialRecord } from '../../types'

interface TokenInfo {
  id: string
  decimals: number
  name: string
  symbol: string
}

interface GetTokenInfoResponseData {
  tokenById: PartialRecord<string, TokenInfo>
}

interface GetTokenInfoResponse {
  code: number
  message: string
  data: GetTokenInfoResponseData
  requestId: string
}

const useTokenInfoFn = async ({ tokens }: { key: string; tokens: string[] }) => {
  if (tokens.length === 0) return
  const url = `${AGGREGATOR_URL}/v1/tokens?` + tokens.map((t) => `ids[]=${t}`).join('&')
  const response = await axios<GetTokenInfoResponse>(url)
  if (response.status === 200) {
    return response.data
  }
  return undefined
}

function useTokenInfo(tokens: string[]) {
  const {
    data: response,
    error,
    isValidating,
  } = useSWR({ key: 'useTokenInfo', tokens }, useTokenInfoFn, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  })

  const res = useMemo(() => {
    return {
      isValidating,
      error,
      tokenInfoMap: response?.data.tokenById,
    }
  }, [error, isValidating, response?.data.tokenById])

  return res
}

interface RawCoinInfo {
  id: string
  decimals: number
  name: string
  symbol: string
  logoUrl: string
}

function useWhitelistedTokens() {
  const fn = useCallback(async () => {
    const url = 'https://raw.githubusercontent.com/anqa-ag/aptos-coin-list/main/anqaTokenList.json'
    const response = await axios<RawCoinInfo[]>(url)
    if (response.status === 200) {
      return response.data
    }
    return undefined
  }, [])

  const { data } = useSWR('useWhitelistedTokens', fn)
  const res = useMemo(() => {
    if (!data) return undefined
    const m: PartialRecord<string, RawCoinInfo> = {}
    for (const token of data) {
      m[token.id] = token
    }
    return m
  }, [data])
  return res
}

function FollowingTokenUpdater() {
  const dispatch = useAppDispatch()

  const whitelistedTokenMap = useWhitelistedTokens()
  useEffect(() => {
    if (whitelistedTokenMap) {
      dispatch(addTokensToFollow(Object.keys(whitelistedTokenMap)))
      const newTokenData: PartialRecord<string, Token> = {}
      for (const key of Object.keys(whitelistedTokenMap)) {
        newTokenData[key] = {
          id: key,
          name: whitelistedTokenMap[key]!.name,
          symbol: whitelistedTokenMap[key]!.symbol,
          decimals: whitelistedTokenMap[key]!.decimals,
          whitelisted: true,
          logoUrl: whitelistedTokenMap[key]!.logoUrl,
        }
      }
      dispatch(updateTokenData(newTokenData))
    }
  }, [dispatch, whitelistedTokenMap])

  const followingTokenAddresses = useAppSelector((state) => state.token.followingTokenAddresses)
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)

  const missingTokenInfoAddresses = useMemo(() => {
    const res: string[] = []
    for (const address of followingTokenAddresses) {
      if (followingTokenData[address] === undefined) {
        res.push(address)
      }
    }
    return res
  }, [followingTokenAddresses, followingTokenData])

  const { tokenInfoMap } = useTokenInfo(missingTokenInfoAddresses)
  useEffect(() => {
    if (tokenInfoMap) {
      const newTokenData: PartialRecord<string, Token> = {}
      for (const address of Object.keys(tokenInfoMap)) {
        newTokenData[address] = {
          id: tokenInfoMap[address]!.id,
          name: tokenInfoMap[address]!.name,
          symbol: tokenInfoMap[address]!.symbol,
          decimals: tokenInfoMap[address]!.decimals,
          whitelisted: false,
          logoUrl: undefined,
        }
      }
      dispatch(updateTokenData(newTokenData))
    }
  }, [dispatch, tokenInfoMap])

  return null
}

function FullTokensUpdater() {
  useFullTokens() // Preload full tokens.

  return null
}

function TokenUpdater() {
  return (
    <>
      <FollowingTokenUpdater />
      <FullTokensUpdater />
    </>
  )
}

const MemoTokenUpdater = memo(TokenUpdater)
export default MemoTokenUpdater
