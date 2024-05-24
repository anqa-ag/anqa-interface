import { Network } from "@aptos-labs/ts-sdk"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export type WalletProvider = "Martian" | "Petra"

export interface WalletState {
  provider: WalletProvider | undefined
  walletAddress: string | undefined
  network: Network | undefined
}

const initialState: WalletState = {
  provider: undefined,
  walletAddress: undefined,
  network: undefined,
}

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<WalletProvider>) => {
      state.provider = action.payload
      state.walletAddress = undefined
      state.network = undefined
    },
    connect: (state, action: PayloadAction<Omit<WalletState, "provider">>) => {
      state.network = action.payload.network
      state.walletAddress = action.payload.walletAddress
    },
    updateWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload
    },
    updateNetwork: (state, action: PayloadAction<string>) => {
      const nextNetwork = action.payload.toLowerCase()
      if (nextNetwork.includes(Network.MAINNET)) state.network = Network.MAINNET
      else if (nextNetwork.includes(Network.TESTNET)) state.network = Network.TESTNET
      else if (nextNetwork.includes(Network.DEVNET)) state.network = Network.DEVNET
      else if (nextNetwork.includes(Network.LOCAL)) state.network = Network.LOCAL
      else if (nextNetwork.includes(Network.CUSTOM)) state.network = Network.CUSTOM
    },
    disconnect: (state) => {
      state.provider = undefined
      state.walletAddress = undefined
      state.network = undefined
    },
  },
})

export const { setProvider, connect, updateWalletAddress, updateNetwork, disconnect } = walletSlice.actions

export default walletSlice.reducer
