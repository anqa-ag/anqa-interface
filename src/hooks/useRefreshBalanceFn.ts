import { useCallback } from "react"
import { useAppDispatch } from "../redux/hooks"
import useAnqaWallet from "./useAnqaWallet"
import { aptos } from "../utils/aptos"
import { updateBalance } from "../redux/slices/wallet"
import { addTokensToFollow } from "../redux/slices/token"

export default function useRefreshBalanceFn() {
  const dispatch = useAppDispatch()

  const { account } = useAnqaWallet()

  const fn = useCallback(async () => {
    if (!account) return
    const _accountCoinsData = await aptos.getAccountCoinsData({
      accountAddress: account.address,
    })
    const accountCoinsData = _accountCoinsData
      .filter((item) => item.amount)
      .reduce(
        (prev, curr) => ({ ...prev, [curr.asset_type]: { ...curr, amount: curr.amount.toString() as string } }),
        {},
      )
    dispatch(updateBalance(accountCoinsData))
    dispatch(addTokensToFollow(_accountCoinsData.map((item) => item.asset_type)))
  }, [account, dispatch])

  return fn
}
