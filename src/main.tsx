import React from "react"
import ReactDOM from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { NextUIProvider } from "@nextui-org/react"
import { PersistGate } from "redux-persist/integration/react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { persistor, store } from "./redux/store"
import App from "./App"

import "react-tooltip/dist/react-tooltip.css"
import "react-toastify/dist/ReactToastify.css"
import "./main.css"
import "./main.scss"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <NextUIProvider>
        <PersistGate persistor={persistor} loading={null}>
          <RouterProvider router={router} />
        </PersistGate>
      </NextUIProvider>
    </ReduxProvider>
  </React.StrictMode>,
)
