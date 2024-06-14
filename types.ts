import { GetAccountCoinsDataResponse, Network, UserTransactionResponse } from "@aptos-labs/ts-sdk"

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never
export type AccountCoinData = Omit<ArrayElement<GetAccountCoinsDataResponse>, "amount"> & { amount: string }
export type WalletBalance = Record<string, AccountCoinData | undefined>

// ###############################################################################
// #
// #                                                                       MARTIAN
// #
// ###############################################################################

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

interface IMartian {
  connect: () => Promise<IMartianConnectResponse>
  disconnect: () => Promise<void>
  network: () => Promise<Network>
  onNetworkChange: (fn: (network: Network) => void) => void
  onAccountChange: (fn: (walletAddress: string) => void) => void
  generateTransaction: (walletAddress: string, payload: IPetraSignAndSubmitTransactionData["payload"]) => Promise<any>
  signAndSubmitTransaction: (tx: any) => Promise<string>
}

// ###############################################################################
// #
// #                                                                         PETRA
// #
// ###############################################################################

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

interface IPetra {
  connect: () => Promise<IPetraConnectResponse>
  account: () => Promise<IPetraConnectResponse>
  disconnect: () => Promise<void>
  network: () => Promise<Network>
  onNetworkChange: (fn: (network: IPetraNetwork) => void) => void
  onAccountChange: (fn: (response: IPetraConnectResponse) => void) => void
  signAndSubmitTransaction: (data: IPetraSignAndSubmitTransactionData) => Promise<UserTransactionResponse>
}

declare global {
  interface Window {
    martian: IMartian | undefined
    aptos: IPetra | undefined
  }
}

export const martian = window.martian
export const petra = window.aptos
