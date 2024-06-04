import React from "react"
import ReactDOM from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { NextUIProvider } from "@nextui-org/react"
import { persistor, store } from "./redux/store"
import "./main.css"
import "./main.scss"
import App from "./App"
import "react-tooltip/dist/react-tooltip.css"
import { PersistGate } from "redux-persist/integration/react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

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
