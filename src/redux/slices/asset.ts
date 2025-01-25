import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'
import { PartialRecord } from '../../types'

export interface Asset {
  id: string
  coinType?: string
  faAddress: string
  name: string
  symbol: string
  displaySymbol?: string
  type?: 'legacy' // custom from fe
  decimals: number
  whitelisted: boolean
  logoUrl?: string
}

export const APTOS: Asset = {
  id: '0xa',
  faAddress: '0xa',
  coinType: '0x1::aptos_coin::AptosCoin',
  symbol: 'APT',
  name: 'Aptos Coin',
  decimals: 8,
  whitelisted: true,
  logoUrl: 'https://raw.githubusercontent.com/anqa-ag/aptos-coin-list/main/icons/APT.webp',
}

export interface TokenState {
  followingTokenAddresses: string[]
  followingTokenData: PartialRecord<string, Asset>
}

const initialState: TokenState = {
  followingTokenAddresses: [],
  followingTokenData: {},
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    addTokensToFollow: (state, action: PayloadAction<string[]>) => {
      const set = new Set(state.followingTokenAddresses)
      for (const address of action.payload) set.add(address)
      state.followingTokenAddresses = Array.from(set)
    },
    updateTokenData: (state, action: PayloadAction<PartialRecord<string, Asset>>) => {
      for (const key of Object.keys(action.payload)) {
        state.followingTokenData[key] = action.payload[key]
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState
    })
  },
})

export const { addTokensToFollow, updateTokenData } = tokenSlice.actions

export default tokenSlice.reducer
