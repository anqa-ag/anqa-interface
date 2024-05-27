import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface Token {
  id: string
  name: string
  symbol: string
  decimals: number
  logoUrl?: string
}

export interface TokenState {
  followingTokenAddresses: string[]
  followingTokenData: Record<string, Token>
}

const initialState: TokenState = {
  followingTokenAddresses: [],
  followingTokenData: {},
}

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    addTokensToFollow: (state, action: PayloadAction<string[]>) => {
      const set = new Set(state.followingTokenAddresses)
      for (const address of action.payload) set.add(address)
      state.followingTokenAddresses = Array.from(set)
    },
    updateTokenData: (state, newTokenData: PayloadAction<Record<string, Token>>) => {
      for (const key of Object.keys(newTokenData.payload)) {
        state.followingTokenData[key] = newTokenData.payload[key]
      }
    },
  },
})

export const { addTokensToFollow, updateTokenData } = tokenSlice.actions

export default tokenSlice.reducer
