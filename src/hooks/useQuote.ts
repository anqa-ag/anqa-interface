import { useMemo } from 'react'
import useSWR from 'swr'
import { AGGREGATOR_URL, BIP_BASE_BN } from '../constants'
import { getRouteV2, RawHop } from '@anqa-ag/ts-sdk'
import { Asset } from '../redux/slices/asset.ts'
import { InputEntryFunctionData } from '@aptos-labs/ts-sdk'
import invariant from 'tiny-invariant'
import { useAppSelector } from '../redux/hooks'
import { SUPPORTED_POOLS } from '../constants/pool.ts'

export interface Hop {
  srcAsset: Asset
  dstAsset: Asset
  srcAmount: string
  dstAmount: string
  pool: ValueOf<typeof SUPPORTED_POOLS>
}

export interface ParsedGetRouteResponseData {
  srcAsset: Asset
  dstAsset: Asset
  srcAmount: string
  dstAmount: string
  paths: Hop[][]
  swapData: InputEntryFunctionData | undefined
}

export default function useQuote(
  {
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
    feeReceiver
  }: {
    isSwapping: boolean,
    sender?: string,
    receiver?: string,
    srcAsset?: string,
    dstAsset?: string,
    srcAmount?: string,
    slippageBps?: number,
    includeSources?: string,
    feeReceiver?: string,
    feeBps?: number
    chargeFeeBy: 'token_in' | 'token_out'
  }) {
  const isFeeIn = chargeFeeBy === 'token_in'
  const {
    data,
    error,
    isValidating,
    mutate
  } = useSWR(
    {
      key: 'useQuote',
      aggregatorBaseUrl: AGGREGATOR_URL,
      sender,
      receiver,
      srcAsset,
      dstAsset,
      srcAmount,
      slippageBps,
      isFeeIn,
      feeReceiver,
      feeInBps: feeBps,
      includeSources
    },
    getRouteV2,
    {
      isPaused: () => isSwapping
    }
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
      numberOfPools: numberOfPools
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
            pool: pool
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
          functionArguments: Object.values(data.tx.functionArguments)
        } as InputEntryFunctionData
      }
      const res: ParsedGetRouteResponseData = {
        srcAsset,
        dstAsset,
        srcAmount: data.srcAmount,
        dstAmount: data.dstAmount,
        paths,
        swapData
      }
      return res
    } catch (err) {
      console.error(err)
      return undefined
    }
  }, [data, followingTokenData])

  const amountOutAfterFee = useMemo(() => {
    if (!data) return undefined
    const amountOut = data.dstAmount
    if (!amountOut || feeBps === undefined) return
    if (chargeFeeBy === 'token_out') {
      return ((BigInt(amountOut) * (BIP_BASE_BN - BigInt(feeBps))) / BIP_BASE_BN).toString()
    }
    return amountOut
  }, [chargeFeeBy, feeBps, data])
  return useMemo(
    () => ({
      isValidating,
      error,
      dstAmount: amountOutAfterFee,
      paths: parsedData?.paths,
      swapData: parsedData?.swapData,
      sourceInfo,
      reFetch: mutate
    }),
    [error, isValidating, mutate, amountOutAfterFee, parsedData?.paths, parsedData?.swapData, sourceInfo]
  )
}
