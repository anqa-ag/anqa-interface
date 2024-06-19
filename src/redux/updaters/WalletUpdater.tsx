import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { memo, useCallback, useEffect } from "react"
import { useInterval } from "usehooks-ts"
import { aptos } from "../../utils/aptos"
import { useAppDispatch } from "../hooks"
import { addTokensToFollow } from "../slices/token"
import { updateBalance } from "../slices/wallet"
import { useWalletDeep } from "../../hooks/useWalletDeep.ts"

function WalletUpdater() {
  const dispatch = useAppDispatch()

  const { account } = useWallet()
  const { address: addressFromTelegramConnect } = useWalletDeep()

  const fn = useCallback(async () => {
    let _accountCoinsData
    if (account) {
      _accountCoinsData = await aptos.getAccountCoinsData({
        accountAddress: account.address
      })
    } else if (addressFromTelegramConnect) {
      _accountCoinsData = await aptos.getAccountCoinsData({
        accountAddress: addressFromTelegramConnect
      })
    } else {
      return
    }

    const accountCoinsData = _accountCoinsData
      .filter((item) => item.amount)
      .reduce(
        (prev, curr) => ({ ...prev, [curr.asset_type]: { ...curr, amount: curr.amount.toString() as string } }),
        {}
      )
    dispatch(updateBalance(accountCoinsData))
    dispatch(addTokensToFollow(_accountCoinsData.map((item) => item.asset_type)))
  }, [account, addressFromTelegramConnect, dispatch])

  useEffect(() => {
    void fn()
  }, [fn])

  useInterval(fn, 10000)

  return null
}

const MemoWalletUpdater = memo(WalletUpdater)
export default MemoWalletUpdater
