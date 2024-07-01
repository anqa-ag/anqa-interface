import TelegramWebApp from "@twa-dev/sdk"
import { useEffect } from "react"
import ReactGA from "react-ga4"
import { useSearchParams } from "react-router-dom"

import { useAppDispatch } from "../hooks"
import { updateTelegramState } from "../slices/telegram"

function initTelegramWebApp() {
  if (TelegramWebApp.initDataUnsafe.user) {
    ReactGA.event({ category: "Telegram Web App", action: "TWA/init" })

    TelegramWebApp.expand()

    const num = 9999
    document.body.addEventListener("touchstart", function () {
      document.documentElement.style.marginTop = num + "px"
      document.documentElement.style.height = window.innerHeight + num + "px"
      document.documentElement.style.overflow = "hidden"
      window.scrollTo(0, num)
    })
    document.body.style.position = "fixed"
    document.body.style.bottom = "0"
    document.body.style.width = "100%"
    document.body.style.height = "100vh"
    const root = document.querySelector<HTMLDivElement>("#root")
    if (root) {
      root.style.overflowY = "scroll"
      root.style.height = "100%"
    }
  }
}

export default function TelegramUpdater() {
  useEffect(() => {
    initTelegramWebApp()
  }, [])

  const [params] = useSearchParams()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const tgWebAppStartParam = params.get("tgWebAppStartParam")
    if (tgWebAppStartParam) {
      const decodedData = JSON.parse(atob(tgWebAppStartParam || ""))
      const method = decodedData.method
      if (method === "connect") {
        const address = decodedData.address
        const publicKey = decodedData.publicKey
        const petraPublicEncryptedKey = decodedData.petraPublicEncryptedKey
        dispatch(updateTelegramState({ address, publicKey, petraPublicEncryptedKey }))
      }
    }
  }, [dispatch, params])

  return null
}
