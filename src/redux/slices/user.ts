import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { VERSION } from "../../constants"
import { PURGE } from "redux-persist"

export interface ITransactionHistory {
  version: string | undefined
  isSuccess: boolean
  details: string | undefined
  tokenInSymbol: string | undefined
  tokenOutSymbol: string | undefined
  readableAmountIn: string
  readableAmountOut: string
}

export interface UserState {
  version: number
  slippageBps: number
  txHistoryMap: Record<string, ITransactionHistory>
}

const initialState: UserState = {
  version: VERSION,
  slippageBps: 50,
  txHistoryMap: {},
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSlippage: (state, action: PayloadAction<number>) => {
      state.slippageBps = action.payload
    },
    addTransactionHistory: (state, action: PayloadAction<ITransactionHistory>) => {
      if (!action.payload.version) return

      if (state.txHistoryMap) {
        state.txHistoryMap[action.payload.version] = action.payload
        return
      }
      state.txHistoryMap = {
        [action.payload.version]: action.payload,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState
    })
  },
})

export const { setSlippage, addTransactionHistory } = userSlice.actions

export default userSlice.reducer
