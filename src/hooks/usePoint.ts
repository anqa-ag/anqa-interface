import { POINT_SYSTEM_URL } from "../constants"
import axios from "axios"
import useSWR from "swr"
import { useMemo } from "react"
import { mulpowToFraction } from "../utils/number.ts"

interface GetPointResponse {
  code: number
  message: string
  data: GetPointResponseData
  requestId: string
}

interface GetPointResponseData {
  totalPoint: string
}

const fn = async ({ walletAddress }: { walletAddress: string }) => {
  if (!walletAddress) return
  const url = `${POINT_SYSTEM_URL}/v1/point/${walletAddress}`
  const response = await axios<GetPointResponse>(url)
  if (response.status === 200) {
    return response.data
  }
  return undefined
}

export default function usePoint(walletAddress: string | undefined) {
  const {
    data: response,
    error,
    isValidating,
    mutate
  } = useSWR({ key: "usePoint", walletAddress }, fn, {
    refreshInterval: 60000
  })

  const res = useMemo(() => {
    return {
      isValidating,
      error,
      mutatePoint: mutate,
      totalPoint: mulpowToFraction(response?.data?.totalPoint ?? "0")
    }
  }, [error, isValidating, response?.data.totalPoint, mutate])

  return res
}
