import nacl from "tweetnacl"
import bs58 from "bs58"
import { useParseConnection } from "./useParseConnection.ts"
import { Buffer } from "buffer"
import { getTelegramWebApp } from "./useTelegramWebApp.ts"

export const encryptPayload = (payload: any, sharedSecret?: Uint8Array | null) => {
  if (!sharedSecret) throw new Error("missing shared secret")
  const nonce = nacl.randomBytes(24)
  const encryptedPayload = nacl.box.after(Buffer.from(JSON.stringify(payload)), nonce, sharedSecret)
  return [nonce, encryptedPayload]
}

export const sendEncryptedPayload = (
  openLink: string,
  payload: any,
  sharedSecret: Uint8Array | undefined,
  redirect: string,
) => {
  const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret)
  const params = {
    appInfo: { domain: "https://" + window.location.hostname },
    dappEncryptionPublicKey: Buffer.from(bs58.decode(import.meta.env.VITE_DAPP_PUBLIC_KEY || "")).toString("hex"),
    payload: Buffer.from(encryptedPayload).toString("hex"),
    redirectLink: redirect,
    nonce: Buffer.from(nonce).toString("hex"),
  }
  getTelegramWebApp()?.openLink(openLink + btoa(JSON.stringify(params)))
}

export function useWalletDeep(): {
  address: string | null
  signTransaction: (transaction: any, redirect: string) => void
} {
  const { address, sharedSecret } = useParseConnection()

  const signTransaction = (transaction: any, redirect: string) => {
    sendEncryptedPayload(" https://petra.app/api/v1/signAndSubmit?data=", transaction, sharedSecret, redirect)
  }

  return {
    address,
    signTransaction,
  }
}
