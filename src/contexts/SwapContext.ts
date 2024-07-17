import { createContext } from "react"

export const SwapContext = createContext({
  swapLocation: "/swap/APT-zUSDC",
  setSwapLocation: (_value: string) => {},
})
