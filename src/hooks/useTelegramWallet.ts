import { AccountInfo, InputTransactionData } from "@aptos-labs/wallet-adapter-react"
import TelegramWebApp from "@twa-dev/sdk"
import { Network } from "aptos"
import bs58 from "bs58"
import { Buffer } from "buffer"
import eruda from "eruda"
import { useCallback, useEffect, useMemo } from "react"
import ReactGA from "react-ga4"
import nacl from "tweetnacl"
import { PETRA_ENCRYPTION_PUBLIC_KEY, TELEGRAM_REDIRECT_URL, petraWallet } from "../constants/index.ts"
import { AnqaWalletState } from "./useAnqaWallet.ts"

function initTelegramWebApp() {
  TelegramWebApp.expand()
  if (TelegramWebApp.initDataUnsafe.user) {
    eruda.init({ autoScale: true })

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

function encryptPayload(payload: any, sharedSecret?: Uint8Array | null) {
  if (!sharedSecret) throw new Error("missing shared secret")
  const nonce = nacl.randomBytes(24)
  const encryptedPayload = nacl.box.after(Buffer.from(JSON.stringify(payload)), nonce, sharedSecret)
  return [nonce, encryptedPayload]
}

function sendEncryptedPayload(openLink: string, payload: any, sharedSecret: Uint8Array | undefined) {
  const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret)
  const params = {
    appInfo: { domain: "https://" + window.location.hostname },
    dappEncryptionPublicKey: Buffer.from(bs58.decode(PETRA_ENCRYPTION_PUBLIC_KEY)).toString("hex"),
    payload: Buffer.from(encryptedPayload).toString("hex"),
    redirectLink: TELEGRAM_REDIRECT_URL + `/ul/sendTx`,
    nonce: Buffer.from(nonce).toString("hex"),
  }
  TelegramWebApp.openLink(openLink + btoa(JSON.stringify(params)))
}

export default function useTelegramWallet(): AnqaWalletState {
  useEffect(() => {
    initTelegramWebApp()
  }, [])

  const account: AccountInfo | null = useMemo(() => null, [])

  const connect = useCallback(() => {
    ReactGA.event({ category: "Telegram Web App", action: "TWA/connect" })
    const params = {
      dappEncryptionPublicKey: Buffer.from(bs58.decode(PETRA_ENCRYPTION_PUBLIC_KEY)).toString("hex"),
      appInfo: { domain: "https://" + window.location.hostname },
      redirectLink: TELEGRAM_REDIRECT_URL + `/ul/connect`,
    }
    TelegramWebApp.openLink(`https://petra.app/api/v1/connect?data=${btoa(JSON.stringify(params))}`)
  }, [])

  const disconnect = useCallback(() => {
    ReactGA.event({ category: "Telegram Web App", action: "TWA/disconnect" })
  }, [])

  // eslint-disable-next-line @typescript-eslint/require-await
  const signAndSubmitTransaction = useCallback(async (transaction: InputTransactionData) => {
    ReactGA.event({ category: "Telegram Web App", action: "TWA/signAndSubmitTransaction" })
    sendEncryptedPayload(" https://petra.app/api/v1/signAndSubmit?data=", transaction, undefined)
  }, [])

  // Properties are based on account.
  const res: AnqaWalletState = useMemo(
    () => ({
      account,
      connect,
      connected: !!account,
      disconnect,
      isLoading: false,
      signAndSubmitTransaction,
      wallet: account ? { name: petraWallet.name, icon: petraWallet.icon, url: petraWallet.url } : null,
      network: account ? { name: Network.MAINNET } : null,
    }),
    [account, connect, disconnect, signAndSubmitTransaction],
  )

  return res
}
