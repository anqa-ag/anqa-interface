import { useCallback } from 'react'
import { useAppDispatch } from '../redux/hooks'
import useAnqaWallet from './useAnqaWallet'
import { aptos } from '../utils/aptos'
import { updateBalance, WalletBalance } from '../redux/slices/wallet'
import { addTokensToFollow } from '../redux/slices/asset.ts'

const LIMIT = 100

export default function useRefreshBalanceFn() {
  const dispatch = useAppDispatch()

  const { account } = useAnqaWallet()

  const fn = useCallback(async () => {
    if (!account) return
    const walletBalance: WalletBalance = {}
    let offset = 0
    while (true) {
      const _accountCoinsData = await aptos.getAccountCoinsData({
        accountAddress: account.address,
        options: {
          offset: offset,
          limit: LIMIT,
          orderBy: [{ amount: 'asc' }],
        },
      })
      if (_accountCoinsData.length === 0) break
      _accountCoinsData
        .filter((item) => item.asset_type && item.amount)
        .forEach((item) => {
          walletBalance[item.asset_type!] = { ...item, amount: item.amount.toString() }
        })
      offset += LIMIT
    }
    dispatch(updateBalance(walletBalance))
    dispatch(addTokensToFollow(Object.keys(walletBalance)))
  }, [account, dispatch])

  return fn
}
