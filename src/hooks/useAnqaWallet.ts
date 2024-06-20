import { useWallet } from "@aptos-labs/wallet-adapter-react"

export default function useAnqaWallet() {
  const { account, connected, disconnect, connect, signAndSubmitTransaction } = useWallet()
}
