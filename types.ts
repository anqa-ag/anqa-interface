import { GetAccountCoinsDataResponse, Network } from "@aptos-labs/ts-sdk"

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never
export type AccountCoinData = Omit<ArrayElement<GetAccountCoinsDataResponse>, "amount"> & { amount: string }
export type WalletBalance = Record<string, AccountCoinData | undefined>

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
}

export interface IPetraConnectResponse {
  address: string
  publicKey: string
}

interface IPetra {
  connect: () => Promise<IPetraConnectResponse>
  account: () => Promise<IPetraConnectResponse>
  disconnect: () => Promise<void>
  network: () => Promise<Network>
  onNetworkChange: (fn: (network: Network) => void) => void
  onAccountChange: (fn: (response: IPetraConnectResponse) => void) => void
}

declare global {
  interface Window {
    martian: IMartian | undefined
    aptos: IPetra | undefined
  }
}

export const martian = window.martian
export const petra = window.aptos
