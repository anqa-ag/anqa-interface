import { Aptos, AptosConfig, MoveStructId, Network } from "@aptos-labs/ts-sdk"
import { useEffect } from "react"
import { useAppSelector } from "../redux/hooks"

const aptosConfig = new AptosConfig({ network: Network.MAINNET })
const aptos = new Aptos(aptosConfig)

const abc = async () => {
  // const balance = await aptos.getAccountAPTAmount({
  //   accountAddress: "0x5e32227acd569fe23924b4aed9e970ff1902dfaf3d5c0d5861cc3e0e2c96afe6",
  // })
  //   console.log("balance", balance)
  // const ledgerInfo = await aptos.getLedgerInfo()
  //   console.log("ledgerInfo", ledgerInfo)
  // const block = await aptos.getBlockByVersion({ ledgerVersion: Number.parseInt(ledgerInfo.ledger_version) })
  // console.log("block", block.block_height)
}
void abc()

export default function useBalance(coinType?: MoveStructId) {
  const walletAddress = useAppSelector((state) => state.wallet.walletAddress)
  useEffect(() => {
    const fn = async () => {
      if (!walletAddress || !coinType) return
      const balance = await aptos.getAccountCoinAmount({
        accountAddress: walletAddress,
        coinType: coinType,
      })
      console.log("balance", balance)
    }

    void fn()
  }, [coinType, walletAddress])
}
