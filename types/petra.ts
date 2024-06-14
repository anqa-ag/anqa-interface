import { Network, UserTransactionResponse } from "@aptos-labs/ts-sdk"

export interface IPetraConnectResponse {
  address: string
  publicKey: string
}

export interface IPetraNetwork {
  chainId: string
  name: string
  url: string
}

export interface IPetraSignAndSubmitTransactionData {
  payload: {
    function: string
    arguments: ((number | string)[] | string)[]
    type_arguments: string[]
  }
}

export interface IPetra {
  connect: () => Promise<IPetraConnectResponse>
  account: () => Promise<IPetraConnectResponse>
  disconnect: () => Promise<void>
  network: () => Promise<Network>
  onNetworkChange: (fn: (network: IPetraNetwork) => void) => void
  onAccountChange: (fn: (response: IPetraConnectResponse) => void) => void
  signAndSubmitTransaction: (data: IPetraSignAndSubmitTransactionData) => Promise<UserTransactionResponse>
}
