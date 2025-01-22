import { useMemo } from 'react'
import { useAppSelector } from '../redux/hooks'
import { Fraction } from '../utils/fraction.ts'
import { WalletBalance } from '../redux/slices/wallet.ts'
import { PartialRecord } from '../types.ts'
import { TokenWithBalance } from '../components/modals/ModalSelectToken.tsx'
import useFullTokens from './useFullTokens.ts'
import { divpowToFraction, mulpowToFraction } from '../utils/number.ts'
import useAnqaWallet from './useAnqaWallet.ts'
import { useTokenInfo } from './useTokenInfo.ts'

export function useTokenBalance(tokenSymbolOrAddress: string) {
  const { tokenAddress, tokenDecimals } = useTokenInfo(tokenSymbolOrAddress)
  const { balance, coinBalance } = useAppSelector((state) => state.wallet)
  const tokenBalance = useMemo(
    () => balance[tokenAddress] || coinBalance[tokenAddress],
    [balance, coinBalance, tokenAddress],
  )

  const fractionalTokenBalance = useMemo(
    () => (tokenBalance && tokenDecimals !== undefined ? divpowToFraction(tokenBalance, tokenDecimals) : undefined),
    [tokenBalance, tokenDecimals],
  )

  return useMemo(
    () => ({
      tokenBalance,
      fractionalTokenBalance,
    }),
    [tokenBalance, fractionalTokenBalance],
  )
}

export const calcTotalTokenBalance = (token: TokenWithBalance) => {
  let totalBalance = new Fraction(0)
  let totalBalanceUsd = new Fraction(0)

  if (token?.faBalance) totalBalance = totalBalance.add(token.faBalance)
  if (token?.coinBalance) totalBalance = totalBalance.add(token.coinBalance)

  if (token?.faBalanceUsd) totalBalanceUsd = totalBalanceUsd.add(token.faBalanceUsd)
  if (token?.coinBalanceUsd) totalBalanceUsd = totalBalanceUsd.add(token.coinBalanceUsd)

  return { totalBalance, totalBalanceUsd }
}

export const sortBalanceFn = (a: TokenWithBalance, b: TokenWithBalance) => {
  const x = calcTotalTokenBalance(a).totalBalanceUsd
  const y = calcTotalTokenBalance(b).totalBalanceUsd
  if (x.lessThan(y)) {
    return 1
  } else if (x.greaterThan(y)) {
    return -1
  }
  return a.symbol.localeCompare(b.symbol)
}

export const useTotalBalanceToken = (token: TokenWithBalance) => {
  return useMemo(() => calcTotalTokenBalance(token), [token])
}

export const useTokensHasBalance = () => {
  const { balance, coinBalance } = useAppSelector((state) => state.wallet)
  const { account } = useAnqaWallet()
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)

  const { data: fullTokenData } = useFullTokens()
  const followingPriceData = useAppSelector((state) => state.price.followingPriceData)
  const assets = useMemo(() => {
    const res: PartialRecord<string, TokenWithBalance> = {}
    const formatBalance = (key: string, balance: WalletBalance): TokenWithBalance | undefined => {
      try {
        let faBalance: Fraction | undefined
        const tokenBalance = balance[key]
        const tokenInfo = followingTokenData?.[key] || fullTokenData?.[key]
        if (fullTokenData && tokenBalance && tokenInfo) {
          if (account?.address && tokenBalance) {
            faBalance = divpowToFraction(tokenBalance, tokenInfo.decimals)
          }
          let faBalanceUsd: Fraction | undefined
          const price = followingPriceData?.[key] ?? followingPriceData?.[tokenInfo.faAddress]

          if (faBalance && price) {
            const fractionalPrice = mulpowToFraction(price, tokenInfo.decimals)
            faBalanceUsd = faBalance.multiply(fractionalPrice)
          }

          return {
            ...tokenInfo,
            faBalance,
            faBalanceUsd,
            isFollowing: true,
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    for (const key of Object.keys(balance)) {
      const token = formatBalance(key, balance)
      if (!token) continue
      res[key] = token
    }

    for (const key of Object.keys(coinBalance)) {
      const token = formatBalance(key, coinBalance)
      if (!token) continue
      const existKey = Object.keys(res).find((r) => res[r]?.coinType === key)
      if (!existKey) {
        res[token.faAddress] = {
          ...token,
          coinBalance: token?.faBalance,
          coinBalanceUsd: token?.faBalanceUsd,
          faBalance: undefined,
          faBalanceUsd: undefined,
        }
      } else {
        res[existKey] = {
          ...res[existKey]!,
          coinBalance: token?.faBalance,
          coinBalanceUsd: token?.faBalanceUsd,
        }
      }
    }

    return res
  }, [balance, fullTokenData, account?.address, coinBalance, followingPriceData, followingTokenData])

  return assets
}
