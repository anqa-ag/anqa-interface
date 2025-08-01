import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { NextUIProvider } from '@nextui-org/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactGA from 'react-ga4'
import { Provider as ReduxProvider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import 'react-toastify/dist/ReactToastify.css'
import 'react-tooltip/dist/react-tooltip.css'

import Swap from './pages/Swap.tsx'
import NavigateWithParams from './components/NavigateWithParams'
import { MAINNET_WALLETS } from './constants'
import './main.css'
import './main.scss'
import { persistor, store } from './redux/store'
import SwapContextProvider from './contexts/SwapContextProvider.tsx'
import Updaters from './redux/updaters/Updaters.tsx'

ReactGA.initialize('G-B2297K89VL')

// ENV !== 'production' && eruda.init()

export const router = createBrowserRouter([
  {
    path: '/',
    element: <NavigateWithParams to="/swap/APT-USDC" />,
  },
  {
    path: '/swap/:pair',
    element: <Swap />,
  },
  {
    path: '*',
    element: <NavigateWithParams to="/swap/APT-USDC" />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <NextUIProvider>
        <PersistGate persistor={persistor} loading={null}>
          <AptosWalletAdapterProvider plugins={MAINNET_WALLETS} autoConnect={true}>
            <Updaters>
              <SwapContextProvider>
                <RouterProvider router={router} />
              </SwapContextProvider>
            </Updaters>
          </AptosWalletAdapterProvider>
        </PersistGate>
      </NextUIProvider>
    </ReduxProvider>
  </React.StrictMode>,
)
