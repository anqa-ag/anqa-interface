import React from "react"
import ReactDOM from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { NextUIProvider } from "@nextui-org/react"
import { store } from "./app/store"
import "./main.scss"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </ReduxProvider>
  </React.StrictMode>,
)
