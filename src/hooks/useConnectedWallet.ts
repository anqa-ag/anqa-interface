import { useMemo } from "react"
import { useWalletDeep } from "./useWalletDeep.ts"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

export default function useConnectedWallet() {
  const { address: addressFromTelegramConnect } = useWalletDeep()
  const { account } = useWallet()

  const connectedWallet = useMemo(() => {
    return account?.address || addressFromTelegramConnect
  }, [account, addressFromTelegramConnect])

  return {
    connectedWallet
  }
}