import { GetAccountCoinsDataResponse } from "@aptos-labs/ts-sdk"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { PURGE } from "redux-persist"
import { ArrayElement } from "../../types"

export type AccountCoinData = Omit<ArrayElement<GetAccountCoinsDataResponse>, "amount"> & { amount: string }
export type WalletBalance = Record<string, AccountCoinData | undefined>

export interface WalletState {
  balance: WalletBalance
}

const initialState: WalletState = {
  balance: {},
}

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateBalance: (state, action: PayloadAction<WalletBalance>) => {
      state.balance = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState
    })
  },
})

export const { updateBalance } = walletSlice.actions

export default walletSlice.reducer
