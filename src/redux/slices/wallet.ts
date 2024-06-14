import { GetAccountCoinsDataResponse, Network } from "@aptos-labs/ts-sdk"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { ArrayElement } from "../../../types/common"

export type WalletProvider = "Martian" | "Petra"

export type AccountCoinData = Omit<ArrayElement<GetAccountCoinsDataResponse>, "amount"> & { amount: string }
export type WalletBalance = Record<string, AccountCoinData | undefined>

export interface WalletState {
  provider: WalletProvider | undefined
  walletAddress: string | undefined
  balance: WalletBalance
  network: Network | undefined
}

const initialState: WalletState = {
  provider: undefined,
  walletAddress: undefined,
  balance: {}, // NOTE: We might introduce bug when "persist" balance (redux-persist). If then, just need to persist only provider.
  network: undefined,
}

const parseNetwork = (network?: string): Network | undefined => {
  if (!network) return undefined
  network = network.toLowerCase()
  if (network.includes(Network.MAINNET)) return Network.MAINNET
  else if (network.includes(Network.TESTNET)) return Network.TESTNET
  else if (network.includes(Network.DEVNET)) return Network.DEVNET
  else if (network.includes(Network.LOCAL)) return Network.LOCAL
  return Network.CUSTOM
}

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<WalletProvider>) => {
      state.provider = action.payload
      state.walletAddress = undefined
      state.balance = {}
      state.network = undefined
    },
    connect: (state, action: PayloadAction<Omit<WalletState, "provider" | "balance">>) => {
      state.walletAddress = action.payload.walletAddress
      // state.balance = {} // We don't want blink balance.
      state.network = parseNetwork(action.payload.network)
    },
    updateWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload
      state.balance = {}
    },
    updateNetwork: (state, action: PayloadAction<string>) => {
      state.balance = {}
      state.network = parseNetwork(action.payload)
    },
    updateBalance: (state, action: PayloadAction<WalletBalance>) => {
      state.balance = action.payload
    },
    disconnect: (state) => {
      state.provider = undefined
      state.walletAddress = undefined
      state.balance = {}
      state.network = undefined
    },
  },
})

export const { setProvider, connect, updateWalletAddress, updateNetwork, updateBalance, disconnect } =
  walletSlice.actions

export default walletSlice.reducer
