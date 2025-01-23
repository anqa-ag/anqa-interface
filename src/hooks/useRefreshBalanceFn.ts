import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import useAnqaWallet from './useAnqaWallet'
import { aptos } from '../utils/aptos'
import { updateBalance, WalletBalance } from '../redux/slices/wallet'
import { addTokensToFollow, Asset } from '../redux/slices/asset.ts'

export default function useRefreshBalanceFn() {
  const dispatch = useAppDispatch()

  const { account } = useAnqaWallet()

  const fn = useCallback(async () => {
    if (!account) return
    const accountCoinsData: WalletBalance = {}
    const accountFaData: WalletBalance = {}
    const _accountCoinsData = await aptos.queryIndexer<{
      current_fungible_asset_balances: {
        amount: bigint | null
        owner_address: string
        token_standard: string
        asset_type: string
        asset_type_v1: string
        asset_type_v2: string
        amount_v1: string
        amount_v2: string
      }[]
    }>({
      query: {
        query: `
        query CurrentFungibleAsset {
          current_fungible_asset_balances(
            where: {owner_address: {_eq: "${account.address}"}}
          ) {
            amount
            owner_address
            token_standard
            asset_type
            asset_type_v1
            asset_type_v2
            amount_v1
            amount_v2
          }
        }
      `,
      },
    })
    if (_accountCoinsData?.current_fungible_asset_balances) {
      _accountCoinsData?.current_fungible_asset_balances
        .filter((item) => item.asset_type && item.amount)
        .forEach((item) => {
          const keyV2 =
            item.asset_type_v2 === '0x000000000000000000000000000000000000000000000000000000000000000a'
              ? '0xa'
              : item.asset_type_v2
          const keyV1 = item.asset_type_v1
          if (item.amount_v2) accountFaData[keyV2] = item.amount_v2.toString()
          if (item.amount_v1) accountCoinsData[keyV1] = item.amount_v1.toString()
        })
      dispatch(updateBalance({ coinBalance: accountCoinsData, balance: accountFaData }))
      dispatch(addTokensToFollow(Object.keys({ ...accountCoinsData, ...accountFaData }).map((coinType) => coinType)))
    }
  }, [account, dispatch])

  return fn
}

export const useGetTokenBalance = () => {
  const { balance, coinBalance } = useAppSelector((state) => state.wallet)
  return useCallback(
    (token: Asset | undefined) => {
      return (
        (token?.faAddress ? balance?.[token?.faAddress] : null) ||
        (token?.coinType ? coinBalance?.[token?.coinType] : null)
      )
    },
    [balance, coinBalance],
  )
}

export const useTokenBalance = (token: Asset | undefined) => {
  const getBalance = useGetTokenBalance()
  return getBalance(token)
}
