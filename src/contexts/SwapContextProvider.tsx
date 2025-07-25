import { useState, ReactNode } from 'react'
import { SwapContext } from './SwapContext.ts'

export default function SwapContextProvider({ children }: { children: ReactNode }) {
  const [swapLocation, setSwapLocation] = useState('/swap/APT-USDC')

  return (
    <SwapContext.Provider
      value={{
        swapLocation,
        setSwapLocation,
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}
