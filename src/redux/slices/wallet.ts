import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'
import { PartialRecord } from '../../types'

export type WalletBalance = PartialRecord<string, string | undefined>

export interface WalletState {
  balance: WalletBalance // faBalance
  coinBalance: WalletBalance
}

const initialState: WalletState = {
  balance: {},
  coinBalance: {}
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateBalance: (
      state,
      action: PayloadAction<{
        balance: WalletBalance // faBalance
        coinBalance: WalletBalance
      }>,
    ) => {
      state.balance = action.payload.balance
      state.coinBalance = action.payload.coinBalance
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
