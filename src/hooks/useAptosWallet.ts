import { useEffect, useMemo, useState } from "react"
import { useWalletDeep } from "./useWalletDeep.ts"
import { useAppSelector } from "../redux/hooks"
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

export default function useAptosWallet() {
  const [balance, setBalance] = useState<Record<string, any>>({})

  const { address: addressFromTelegramConnect } = useWalletDeep()

  const { balance: balanceFromWalletExtension } = useAppSelector((state) => state.wallet)

  useEffect(() => {
    if (balanceFromWalletExtension && JSON.stringify(balanceFromWalletExtension) !== "{}") {
      setBalance(balanceFromWalletExtension)
    } else if (addressFromTelegramConnect) {
      const aptosConfig = new AptosConfig({ network: Network.MAINNET })
      const aptos = new Aptos(aptosConfig)
      void aptos.getAccountCoinsData({ accountAddress: addressFromTelegramConnect }).then((res) => {
        const coinMap: Record<string, any> = {}
        for (const coin of res) {
          coinMap[coin.asset_type] = coin
        }
        setBalance(coinMap)
      })
    } else {
      setBalance({})
    }
  }, [balanceFromWalletExtension, addressFromTelegramConnect])

  const { address } = useWalletDeep()
  const { account } = useWallet()

  const connectedWallet = useMemo(() => {
    if (account) {
      return account.address
    } else if (address) {
      return address
    }
    return undefined
  }, [account, address])

  return {
    balance,
    connectedWallet
  }
}