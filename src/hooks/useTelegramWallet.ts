import { AccountInfo } from "@aptos-labs/wallet-adapter-react"
import TelegramWebApp from "@twa-dev/sdk"
import { Network } from "aptos"
import bs58 from "bs58"
import { Buffer } from "buffer"
import { useCallback, useMemo } from "react"
import ReactGA from "react-ga4"
import nacl from "tweetnacl"
import { PETRA_ENCRYPTION_PUBLIC_KEY, TELEGRAM_REDIRECT_URL, petraWallet } from "../constants/index.ts"
import { useAppDispatch, useAppSelector } from "../redux/hooks/index.ts"
import { clearTelegramState } from "../redux/slices/telegram.ts"
import { AnqaWalletState } from "./useAnqaWallet.ts"
import { isDesktop } from "react-device-detect"

function encryptPayload(payload: any, sharedSecret?: Uint8Array | null) {
  if (!sharedSecret) throw new Error("missing shared secret")
  const nonce = nacl.randomBytes(24)
  const encryptedPayload = nacl.box.after(Buffer.from(JSON.stringify(payload)), nonce, sharedSecret)
  return [nonce, encryptedPayload]
}

function getPetraWalletParams(payload: any, sharedSecret: Uint8Array | undefined) {
  const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret)
  const params = {
    appInfo: { domain: "https://" + window.location.hostname },
    dappEncryptionPublicKey: Buffer.from(bs58.decode(PETRA_ENCRYPTION_PUBLIC_KEY)).toString("hex"),
    payload: Buffer.from(encryptedPayload).toString("hex"),
    redirectLink: TELEGRAM_REDIRECT_URL + `/ul/sendTx`,
    nonce: Buffer.from(nonce).toString("hex"),
  }
  return params
}

export default function useTelegramWallet(): Omit<AnqaWalletState, "isTelegram"> {
  const dispatch = useAppDispatch()

  const { address, publicKey, petraPublicEncryptedKey } = useAppSelector((state) => state.telegram)
  const account = useMemo<AccountInfo | null>(
    () => (address && publicKey ? { address, publicKey } : null),
    [address, publicKey],
  )

  const connect = useCallback(() => {
    ReactGA.event({ category: "Telegram Web App", action: "TWA/connect" })
    if (isDesktop) {
      TelegramWebApp.showAlert("Currently, the Anqa Telegram Bot is only supported on mobile devices with Petra wallet installed.")
      return
    }
    const params = {
      dappEncryptionPublicKey: Buffer.from(bs58.decode(PETRA_ENCRYPTION_PUBLIC_KEY)).toString("hex"),
      appInfo: { domain: "https://" + window.location.hostname },
      redirectLink: TELEGRAM_REDIRECT_URL + `/ul/connect`,
    }
    TelegramWebApp.openLink(`https://petra.app/api/v1/connect?data=${btoa(JSON.stringify(params))}`)
    TelegramWebApp.close()
  }, [])

  const disconnect = useCallback(() => {
    ReactGA.event({ category: "Telegram Web App", action: "TWA/disconnect" })
    dispatch(clearTelegramState())
  }, [dispatch])

  const signAndSubmitTransaction = useCallback(
    // eslint-disable-next-line @typescript-eslint/require-await
    async (payload: any) => {
      ReactGA.event({ category: "Telegram Web App", action: "TWA/signAndSubmitTransaction" })

      if (!petraPublicEncryptedKey) return
      const params = getPetraWalletParams(payload, bs58.decode(petraPublicEncryptedKey))
      TelegramWebApp.openLink("https://petra.app/api/v1/signAndSubmit?data=" + btoa(JSON.stringify(params)))
      TelegramWebApp.close()
    },
    [petraPublicEncryptedKey],
  )

  // Properties are based on account.
  const res = useMemo<Omit<AnqaWalletState, "isTelegram">>(
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
