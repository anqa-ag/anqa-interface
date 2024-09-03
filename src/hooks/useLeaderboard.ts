import { ANQA_ANALYSIS_URL } from '../constants'
import axios from 'axios'
import useSWR from 'swr'
import { useMemo } from 'react'

interface GetLeaderboardResponse {
  code: number
  message: string
  data: GetLeaderboardResponseData
}

interface GetLeaderboardResponseData {
  leaderboard: Leaderboard[]
  total: string
  user: User
}

export interface Leaderboard {
  rank: number
  address: string
  volume: string
}

export interface User {
  rank: number | null
  totalVolume: string | null
  totalTrades: number | null
}


const fn = async ({ page, walletAddress }: { page: number; walletAddress: string | undefined }) => {
  const url = `${ANQA_ANALYSIS_URL}/v1/leaderboard?limit=10&offset=${(page - 1) * 10}&wallet=${walletAddress || ''}`
  const response = await axios<GetLeaderboardResponse>(url)
  if (response.status === 200) {
    return response.data
  }
  return undefined
}

export default function useLeaderboard(page: number, walletAddress: string | undefined) {
  const {
    data: response,
    error,
    isValidating,
    mutate,
  } = useSWR({ key: 'useLeaderboard', page, walletAddress }, fn, {
    refreshInterval: 60_000,
  })

  const res = useMemo(() => {
    return {
      isValidating,
      error,
      mutate,
      data: response,
    }
  }, [error, isValidating, mutate, response])

  return res
}
