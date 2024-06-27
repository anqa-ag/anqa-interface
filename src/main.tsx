import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import { NextUIProvider } from "@nextui-org/react"
import eruda from "eruda"
import React from "react"
import ReactDOM from "react-dom/client"
import ReactGA from "react-ga4"
import { Provider as ReduxProvider } from "react-redux"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"

import "react-toastify/dist/ReactToastify.css"
import "react-tooltip/dist/react-tooltip.css"

import App from "./App"
import NavigateWithParams from "./components/NavigateWithParams"
import { ENV, MAINNET_WALLETS } from "./constants"
import "./main.css"
import "./main.scss"
import { persistor, store } from "./redux/store"

ReactGA.initialize("G-B2297K89VL")

ENV !== "production" && eruda.init()

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavigateWithParams to="/swap/APT-zUSDC" />,
  },
  {
    path: "/swap/:pair",
    element: <App />,
  },
  {
    path: "*",
    element: <NavigateWithParams to="/swap/APT-zUSDC" />,
  },
])

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
