import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { PURGE } from "redux-persist"

export interface TelegramState {
  address: string | undefined
  publicKey: string | undefined
  petraPublicEncryptedKey: string | undefined
}

const initialState: TelegramState = {
  address: undefined,
  publicKey: undefined,
  petraPublicEncryptedKey: undefined,
}

export const telegramSlice = createSlice({
  name: "telegram",
  initialState,
  reducers: {
    updateTelegramState: (state, action: PayloadAction<TelegramState>) => {
      state.address = action.payload.address
      state.publicKey = action.payload.publicKey
      state.petraPublicEncryptedKey = action.payload.petraPublicEncryptedKey
    },
    clearTelegramState: (state) => {
      state.address = undefined
      state.publicKey = undefined
      state.petraPublicEncryptedKey = undefined
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
