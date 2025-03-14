import axios from 'axios'
import { memo, useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { AGGREGATOR_API_KEY, AGGREGATOR_URL } from '../../constants'
import useFullTokens from '../../hooks/useFullTokens'
import { useAppDispatch, useAppSelector } from '../hooks'
import { addTokensToFollow, Asset, updateTokenData } from '../slices/asset.ts'
import { PartialRecord } from '../../types'

interface TokenInfo {
  id: string
  decimals: number
  name: string
  coinType?: string
  faAddress: string
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
  const response = await axios<GetTokenInfoResponse>(url, {
    headers: {
      'X-API-KEY': AGGREGATOR_API_KEY,
    },
  })
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
  coinType?: string
  faAddress: string
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
    const m: PartialRecord<string, Asset> = {}
    for (const token of data) {
      const asset = { ...token, whitelisted: true, id: token.faAddress } as Asset
      m[token.faAddress] = asset
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
      const newTokenData: PartialRecord<string, Asset> = { ...whitelistedTokenMap }
      Object.values(whitelistedTokenMap ?? {}).forEach((token) => {
        if (token?.coinType) newTokenData[token.coinType] = { ...token, type: 'legacy' }
      })
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
      const newTokenData: PartialRecord<string, Asset> = {}
      for (const address of Object.keys(tokenInfoMap)) {
        const token = tokenInfoMap[address]
        if (token) {
          newTokenData[address] = {
            ...token,
            whitelisted: false,
            logoUrl: undefined,
          }
        }
        if (token?.coinType) {
          newTokenData[token.coinType] = { ...token, whitelisted: false, logoUrl: undefined, type: 'legacy' }
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
