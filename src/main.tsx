import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import { NextUIProvider } from "@nextui-org/react"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"
import ReactGA from "react-ga4";
import App from "./App"
import { persistor, store } from "./redux/store"

import "react-toastify/dist/ReactToastify.css"
import "react-tooltip/dist/react-tooltip.css"
import "./main.css"
import "./main.scss"
import { MAINNET_WALLETS } from "./constants"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
])

ReactGA.initialize('G-WQQBB7YC5W')

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <NextUIProvider>
        <PersistGate persistor={persistor} loading={null}>
          <AptosWalletAdapterProvider plugins={MAINNET_WALLETS} autoConnect={true}>
            <RouterProvider router={router} />
          </AptosWalletAdapterProvider>
        </PersistGate>
      </NextUIProvider>
    </ReduxProvider>
  </React.StrictMode>,
)
