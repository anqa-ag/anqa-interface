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
  Mainnet = "Mainnet",
}

interface IMartian {
  connect: () => Promise<IMartianConnectResponse>
  disconnect: () => Promise<void>
  network: () => Promise<INetwork>
  onNetworkChange: (fn: (network: INetwork) => void) => void
  onAccountChange: (fn: (walletAddress: string) => void) => void
}

declare global {
  interface Window {
    martian: IMartian
  }
}

export const martian = window.martian
