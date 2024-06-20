import { memo, useCallback, useEffect } from "react"
import { useInterval } from "usehooks-ts"
import useAnqaWallet from "../../hooks/useAnqaWallet"
import { aptos } from "../../utils/aptos"
import { useAppDispatch } from "../hooks"
import { addTokensToFollow } from "../slices/token"
import { updateBalance } from "../slices/wallet"

function WalletUpdater() {
  const dispatch = useAppDispatch()

  const { account } = useAnqaWallet()

  const fn = useCallback(async () => {
    if (account) {
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
    }
  }, [account, dispatch])

  useEffect(() => {
    void fn()
  }, [fn])

  useInterval(fn, 10000)

  return null
}

const MemoWalletUpdater = memo(WalletUpdater)
export default MemoWalletUpdater
