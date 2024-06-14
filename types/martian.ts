import { Network } from "@aptos-labs/ts-sdk"
import { IPetraSignAndSubmitTransactionData } from "./petra"

export interface IMartianConnectResponse {
  address: string
  id: string
  method: string
  publicKey: string
  status: number
  tabId: number
}

export interface IMartianAccount {
  address: string
  publicKey: string
}

export interface IMartian {
  connect: () => Promise<IMartianConnectResponse>
  disconnect: () => Promise<void>
  network: () => Promise<Network>
  onNetworkChange: (fn: (network: Network) => void) => void
  onAccountChange: (fn: (walletAddress: string) => void) => void
  generateTransaction: (walletAddress: string, payload: IPetraSignAndSubmitTransactionData["payload"]) => Promise<any>
  signAndSubmitTransaction: (tx: any) => Promise<string>
}
