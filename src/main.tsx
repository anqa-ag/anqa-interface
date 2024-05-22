import React from "react"
import ReactDOM from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { NextUIProvider } from "@nextui-org/react"
import { persistor, store } from "./redux/store"
import "./main.scss"
import App from "./App"
import "react-tooltip/dist/react-tooltip.css"
import { PersistGate } from "redux-persist/integration/react"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <NextUIProvider>
        <PersistGate persistor={persistor} loading={null}>
          <App />
        </PersistGate>
      </NextUIProvider>
    </ReduxProvider>
  </React.StrictMode>,
)
