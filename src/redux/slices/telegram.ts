import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { PURGE } from "redux-persist"

export interface TelegramState {
  address: string | undefined
  publicKey: string | undefined
  sharedSecret: Uint8Array | undefined
}

const initialState: TelegramState = {
  address: undefined,
  publicKey: undefined,
  sharedSecret: undefined,
}

export const telegramSlice = createSlice({
  name: "telegram",
  initialState,
  reducers: {
    updateTelegramState: (state, action: PayloadAction<TelegramState>) => {
      console.log(`action`, action.type)
      state.address = action.payload.address
      state.publicKey = action.payload.publicKey
      state.sharedSecret = action.payload.sharedSecret
    },
    clearTelegramState: (state) => {
      state.address = undefined
      state.publicKey = undefined
      state.sharedSecret = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState
    })
  },
})

export const { updateTelegramState, clearTelegramState } = telegramSlice.actions

export default telegramSlice.reducer
