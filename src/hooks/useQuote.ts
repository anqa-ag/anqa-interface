import { useMemo } from 'react'
import useSWR from 'swr'
import { AGGREGATOR_API_KEY, AGGREGATOR_URL } from '../constants'
import { Asset } from '../redux/slices/asset.ts'
import { InputEntryFunctionData } from '@aptos-labs/ts-sdk'
import invariant from 'tiny-invariant'
import { useAppSelector } from '../redux/hooks'
import { SUPPORTED_POOLS } from '../constants/pool.ts'
import { ValueOf } from '../types.ts'
import axios from 'axios'

export interface Hop {
  srcAsset: Asset
  dstAsset: Asset
  srcAmount: string
  dstAmount: string
  pool: ValueOf<typeof SUPPORTED_POOLS>
}

interface ParsedGetRouteResponseData {
  srcAsset: Asset
  dstAsset: Asset
  srcAmount: string
  dstAmount: string
  paths: Hop[][]
  swapData: InputEntryFunctionData | undefined
}

interface GetRouteV2Response {
  code: number
  message: string
  data: GetRouteV2ResponseData
  requestId: string
}

interface RawHop {
  srcAsset: string
  dstAsset: string
  srcAmount: string
  dstAmount: string
  source: string
}

interface GetRouteV2ResponseData {
  srcAsset: string
  dstAsset: string
  srcAmount: string
  dstAmount: string
  paths: RawHop[][]
  tx:
    | {
        function: string
        typeArguments: string[]
        functionArguments: {
          receiver: string
          amounts: string[]
          routeData: string[]
          faAddresses: any[]
          configAddresses: any[]
          feeReceiver: string
          feeBps: string
          isFeeIn: boolean
          minAmountOut: string
          extraData: string
        }
      }
    | undefined
}

export async function getRouteV2({
  sender,
  receiver,
  srcAsset,
  dstAsset,
  srcAmount,
  slippageBps,
  isFeeIn,
  feeInBps,
  feeReceiver,
  includeSources,
}: {
  sender?: string
  receiver?: string
  srcAsset?: string
  dstAsset?: string
  srcAmount?: string
  slippageBps?: number
  isFeeIn?: boolean
  feeInBps?: string
  feeReceiver: string
  includeSources?: string
}): Promise<GetRouteV2ResponseData | undefined> {
  if (!srcAsset || !dstAsset || !srcAmount || parseFloat(srcAmount) === 0) return
  const excludeSources = ['bapt_swap_v1', 'bapt_swap_v2', 'bapt_swap_v2.1']
  const response = await axios<GetRouteV2Response>(`${AGGREGATOR_URL}/v2/quote`, {
    params: {
      srcAsset: srcAsset,
      dstAsset: dstAsset,
      amount: srcAmount,
      slippage: slippageBps,
      sender,
      receiver,
      feeReceiver,
      includeSources,
      isFeeIn,
      feeInBps,
      excludeSources: excludeSources.join(','),
    },
    headers: {
      'X-API-KEY': AGGREGATOR_API_KEY,
    },
  })
  if (response.status === 200 && response.data.data.dstAmount != '0') {
    return response.data.data
  }
  return undefined
}

export default function useQuote({
  isSwapping,
  sender,
  receiver,
  srcAsset,
  dstAsset,
  srcAmount,
  slippageBps,
  includeSources,
  feeBps,
  chargeFeeBy,
  feeReceiver,
}: {
  isSwapping: boolean
  sender?: string
  receiver?: string
  srcAsset?: string
  dstAsset?: string
  srcAmount?: string
  slippageBps?: number
  includeSources?: string
  feeReceiver?: string
  feeBps?: number
  chargeFeeBy: 'token_in' | 'token_out'
}) {
  const isFeeIn = chargeFeeBy === 'token_in'
  const { data, error, isValidating, mutate } = useSWR(
    {
      key: 'useQuote',
      sender,
      receiver,
      srcAsset,
      dstAsset,
      srcAmount,
      slippageBps,
      isFeeIn,
      feeReceiver,
      feeInBps: feeBps,
      includeSources,
    },
    getRouteV2,
    {
      isPaused: () => isSwapping,
    },
  )
  const sourceInfo = useMemo(() => {
    if (!data?.paths) return undefined
    let numberOfPools = 0
    for (let i = 0; i < data.paths.length; i++) {
      for (let j = 0; j < data.paths[i].length; j++) {
        numberOfPools++
      }
    }
    return {
      numberOfPaths: data.paths.length,
      numberOfPools: numberOfPools,
    }
  }, [data?.paths])

  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
  const parsedData = useMemo(() => {
    if (!data) return undefined
    try {
      const paths: Hop[][] = []
      for (let i = 0; i < data.paths.length; i++) {
        paths.push([])
        for (let j = 0; j < data.paths[i].length; j++) {
          const h: RawHop = data.paths[i][j]
          const srcAsset = followingTokenData[h.srcAsset]
          invariant(srcAsset, 'srcAsset undefined')
          const dstAsset = followingTokenData[h.dstAsset]
          invariant(dstAsset, 'dstAsset undefined')
          const pool = SUPPORTED_POOLS[Object.keys(SUPPORTED_POOLS).find((p) => p === h.source) || ''] || undefined
          invariant(pool, 'pool undefined')
          paths[i].push({
            srcAsset,
            dstAsset,
            srcAmount: h.srcAmount,
            dstAmount: h.dstAmount,
            pool: pool,
          })
        }
      }
      const srcAsset = followingTokenData[data.srcAsset]
      invariant(srcAsset, 'srcAsset undefined')
      const dstAsset = followingTokenData[data.dstAsset]
      invariant(dstAsset, 'dstAsset undefined')
      let swapData: InputEntryFunctionData | undefined
      if (data.tx) {
        swapData = {
          ...data.tx,
          functionArguments: Object.values(data.tx.functionArguments),
        } as InputEntryFunctionData
      }
      const res: ParsedGetRouteResponseData = {
        srcAsset,
        dstAsset,
        srcAmount: data.srcAmount,
        dstAmount: data.dstAmount,
        paths,
        swapData,
      }
      return res
    } catch (err) {
      console.error(err)
      return undefined
    }
  }, [data, followingTokenData])

  return useMemo(
    () => ({
      isValidating,
      error,
      dstAmount: parsedData?.dstAmount,
      paths: parsedData?.paths,
      swapData: parsedData?.swapData,
      sourceInfo,
      reFetch: mutate,
    }),
    [error, isValidating, mutate, parsedData?.dstAmount, parsedData?.paths, parsedData?.swapData, sourceInfo],
  )
}
