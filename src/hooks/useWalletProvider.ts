import { useState, useEffect } from "react"

export interface MartianAccount {
  address: string
  publicKey: string
}

export interface ConnectResponse {
  address: string
  id: string
  method: string
  publicKey: string
  status: number
  tabId: number
}

export enum Network {
  Mainnet = "Mainnet",
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const provider = window.martian

export default function useWalletProvider() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string>()
  const [network, setNetwork] = useState<Network>()

  const onConnect = async () => {
    try {
      if (!provider) return

      if (connectedWallet) return
      setIsConnecting(true)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      const response: ConnectResponse = await provider.connect()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const _network: Network = await provider.network()
      setNetwork(_network)
      setConnectedWallet(response.address)
    } finally {
      setIsConnecting(false)
    }
  }

  // Effect network change.
  useEffect(() => {
    if (!provider) return

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    provider.onNetworkChange((name: any) => setNetwork(name))
  }, [])

  // Effect account change.
  useEffect(() => {
    if (!provider) return

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    provider.onAccountChange((wallet: string) => setConnectedWallet(wallet))
  }, [])

  return {
    isConnecting,
    onConnect,
    connectedWallet,
    network,
  }
}
