import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface UserState {
  slippageBps: number
}

const initialState: UserState = {
  slippageBps: 50,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSlippage: (state, action: PayloadAction<number>) => {
      state.slippageBps = action.payload
    },
  },
})

export const { setSlippage } = userSlice.actions

export default userSlice.reducer
