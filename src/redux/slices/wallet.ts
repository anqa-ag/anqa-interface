import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { INetwork } from "../../../global"

export type WalletProvider = "Martian" | "Petra"

export interface WalletState {
  provider: WalletProvider | undefined
  walletAddress: string | undefined
  network: INetwork | undefined
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
    updateNetwork: (state, action: PayloadAction<INetwork>) => {
      state.network = action.payload
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
