export {}

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

export enum INetwork {
  Testnet = "Testnet",
  Mainnet = "Mainnet",
  Devnet = "Devnet",
}

interface IMartian {
  connect: () => Promise<IMartianConnectResponse>
  disconnect: () => Promise<void>
  network: () => Promise<INetwork>
  onNetworkChange: (fn: (network: INetwork) => void) => void
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
  network: () => Promise<INetwork>
  onNetworkChange: (fn: (network: INetwork) => void) => void
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
