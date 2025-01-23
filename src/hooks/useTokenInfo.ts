import { useMemo } from 'react'
import { APTOS, Asset } from '../redux/slices/asset.ts'
import { useAppSelector } from '../redux/hooks'


export function useTokenInfo(tokenSymbolOrAddress: string, defaultToken: Asset = APTOS) {
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)

  const tokenAddress = useMemo(
    () =>
      (Object.values(followingTokenData) as Asset[]).find((token) => {
        try {
          return token.symbol === tokenSymbolOrAddress || token.id === tokenSymbolOrAddress
        } catch {
          return false
        }
      })?.id || defaultToken.id,
    [defaultToken.id, followingTokenData, tokenSymbolOrAddress],
  )

  const tokenInfo: Asset | undefined = useMemo(
    () => followingTokenData[tokenAddress],
    [followingTokenData, tokenAddress],
  )

  return useMemo(
    () => ({
      tokenAddress,
      tokenInfo,
      tokenDecimals: tokenInfo?.decimals,
    }),
    [tokenAddress, tokenInfo],
  )
}
