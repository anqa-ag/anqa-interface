import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface PriceState {
  // followingPriceAddresses: string[]
  followingPriceData: Record<string, string>
}

const initialState: PriceState = {
  // followingPriceAddresses: [],
  followingPriceData: {},
}

export const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    // addTokensToFollow: (state, action: PayloadAction<string[]>) => {
    //   const set = new Set(state.followingPriceAddresses)
    //   for (const address of action.payload) set.add(address)
    //   state.followingPriceAddresses = Array.from(set)
    // },
    updatePriceData: (state, newPriceData: PayloadAction<Record<string, string>>) => {
      for (const key of Object.keys(newPriceData.payload)) {
        state.followingPriceData[key] = newPriceData.payload[key]
      }
    },
  },
})

// export const { addTokensToFollow, updatePriceData } = priceSlice.actions
export const { updatePriceData } = priceSlice.actions

export default priceSlice.reducer