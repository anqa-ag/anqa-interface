import { createContext } from 'react'

export const SwapContext = createContext({
  swapLocation: '/swap/APT-USDC',
  setSwapLocation: (_value: string) => {},
})
