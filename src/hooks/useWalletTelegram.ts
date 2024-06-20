import nacl from "tweetnacl"
import bs58 from "bs58"
import { useParseConnection } from "./useParseConnection.ts"
import { Buffer } from "buffer"
import { closeTelegramWebApp, getTelegramWebApp } from "./useTelegramWebApp.ts"
import { TELEGRAM_REDIRECT_URL } from "../constants/index.ts"

export const encryptPayload = (payload: any, sharedSecret?: Uint8Array | null) => {
  if (!sharedSecret) throw new Error("missing shared secret")
  const nonce = nacl.randomBytes(24)
  const encryptedPayload = nacl.box.after(Buffer.from(JSON.stringify(payload)), nonce, sharedSecret)
  return [nonce, encryptedPayload]
}

export const sendEncryptedPayload = (openLink: string, payload: any, sharedSecret: Uint8Array | undefined) => {
  const fallbackEnv = import.meta.env.VITE_NETWORK === "mainnet" ? "production" : "dev"
  const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret)
  const params = {
    appInfo: { domain: "https://" + window.location.hostname },
    dappEncryptionPublicKey: Buffer.from(bs58.decode(import.meta.env.VITE_DAPP_PUBLIC_KEY || "")).toString("hex"),
    payload: Buffer.from(encryptedPayload).toString("hex"),
    redirectLink: TELEGRAM_REDIRECT_URL + `/ul/sendTx?fallback_env=${fallbackEnv}`,
    nonce: Buffer.from(nonce).toString("hex"),
  }
  getTelegramWebApp()?.openLink(openLink + btoa(JSON.stringify(params)))
  closeTelegramWebApp()
}

export function useWalletTelegram(): {
  address: string | null
  signTransaction: (transaction: any) => void
  connect: () => void
  disconnect: () => void
} {
  const { address, sharedSecret } = useParseConnection()

  const connect = () => {
    const fallbackEnv = import.meta.env.VITE_NETWORK === "mainnet" ? "production" : "dev"
    const params = {
      dappEncryptionPublicKey: Buffer.from(bs58.decode(import.meta.env.VITE_DAPP_PUBLIC_KEY || "")).toString("hex"),
      appInfo: { domain: "https://" + window.location.hostname },
      redirectLink: TELEGRAM_REDIRECT_URL + `/ul/connect?fallback_env=${fallbackEnv}`,
    }
    getTelegramWebApp()?.openLink(`https://petra.app/api/v1/connect?data=${btoa(JSON.stringify(params))}`)
    closeTelegramWebApp()
  }

  const disconnect = () => {
    localStorage.removeItem("anqa_address")
    localStorage.removeItem("anqa_shared_secret")
    window.location.href = "/"
  }

  const signTransaction = (transaction: any) => {
    sendEncryptedPayload(" https://petra.app/api/v1/signAndSubmit?data=", transaction, sharedSecret)
  }

  return {
    address,
    signTransaction,
    connect,
    disconnect,
  }
}
