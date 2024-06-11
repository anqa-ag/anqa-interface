import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { VERSION } from "../../constants"

export interface NotificationData {
  version: string
  isSuccess: boolean
  tokenInSymbol: string | undefined
  tokenOutSymbol: string | undefined
  readableAmountIn: string
  readableAmountOut: string
  isHide: boolean
}

export interface UserState {
  version: number
  slippageBps: number
  notificationMap: Record<string, NotificationData>
}

const initialState: UserState = {
  version: VERSION,
  slippageBps: 50,
  notificationMap: {},
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSlippage: (state, action: PayloadAction<number>) => {
      state.slippageBps = action.payload
    },
    addNotification: (state, action: PayloadAction<NotificationData>) => {
      if (state.notificationMap) {
        state.notificationMap[action.payload.version] = action.payload
      }
      state.notificationMap = {
        [action.payload.version]: action.payload,
      }
    },
    hideNotification: (state, action: PayloadAction<string>) => {
      state.notificationMap[action.payload].isHide = true
    },
  },
})

export const { setSlippage, addNotification, hideNotification } = userSlice.actions

export default userSlice.reducer
