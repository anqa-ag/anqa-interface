import { memo, useCallback, useEffect, useRef } from "react"
import { IPetraConnectResponse, WalletBalance, martian, petra } from "../../../types"
import { aptos } from "../../utils/aptos"
import { useAppDispatch, useAppSelector } from "../hooks"
import useMartian from "../hooks/useMartian"
import usePetra from "../hooks/usePetra"
import { updateBalance, updateNetwork, updateWalletAddress } from "../slices/wallet"
import { useInterval } from "usehooks-ts"

function useGetAccountCoinsDataInterval() {
  const dispatch = useAppDispatch()

  const walletAddress = useAppSelector((state) => state.wallet.walletAddress)

  const fn = useCallback(async () => {
    if (!walletAddress) return
    const accountCoinsData = await aptos.getAccountCoinsData({
      accountAddress: walletAddress,
    })
    const _accountCoinsData = accountCoinsData.reduce(
      (prev, curr) => ({ ...prev, [curr.asset_type]: { ...curr, amount: curr.amount.toString() as string } }),
      {} as WalletBalance,
    )
    dispatch(updateBalance(_accountCoinsData))
  }, [dispatch, walletAddress])

  useInterval(fn, 10000)
}

function WalletUpdater() {
  useGetAccountCoinsDataInterval()

  const dispatch = useAppDispatch()

  const { onConnect: onConnectMartian } = useMartian()
  const { onConnect: onConnectPetra } = usePetra()

  const provider = useAppSelector((state) => state.wallet.provider)

  const run = useRef(false)
  // Run only once to auto connect.
  useEffect(() => {
    if (run.current) return
    run.current = true
    switch (provider) {
      case "Martian":
        void onConnectMartian()
        break
      case "Petra":
        void onConnectPetra()
        break
    }
  }, [onConnectMartian, onConnectPetra, provider])

  useEffect(() => {
    if (!martian) return
    martian.onNetworkChange((network: string) => dispatch(updateNetwork(network)))
    martian.onAccountChange((walletAddress: string) => dispatch(updateWalletAddress(walletAddress)))
  }, [dispatch])

  useEffect(() => {
    if (!petra) return
    petra.onNetworkChange((network: string) => dispatch(updateNetwork(network)))
    petra.onAccountChange((response: IPetraConnectResponse) => {
      // WARN: Why it's render 8 times in here for each switching?!
      // console.log("response.address", response.address)

      // If the new account has already connected to your app then the newAccount will be returned
      if (response) {
        dispatch(updateWalletAddress(response.address))
      } else void onConnectPetra() // Otherwise you will need to ask to connect to the new account
    })
  }, [dispatch, onConnectPetra])

  return null
}

const MemoWalletUpdater = memo(WalletUpdater)
export default MemoWalletUpdater
