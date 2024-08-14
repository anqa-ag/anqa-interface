import { POINT_SYSTEM_URL } from '../constants'
import axios from 'axios'
import useSWR from 'swr'
import { useMemo } from 'react'

interface GetLeaderboardResponse {
  code: number
  message: string
  data: GetLeaderboardResponseData
}

interface GetLeaderboardResponseData {
  leaderboard: { address: string; totalPoint: string }[]
  totalWallets: number
  userRank: number | null
  userPoint: string | null
}

const fn = async ({ page, walletAddress }: { page: number; walletAddress: string | undefined }) => {
  const url = `${POINT_SYSTEM_URL}/v1/leaderboard?limit=10&offset=${(page - 1) * 10}&wallet=${walletAddress || ''}`
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
