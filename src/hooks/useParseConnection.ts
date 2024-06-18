import bs58 from "bs58"
import { useSearchParams } from "react-router-dom"
import { Buffer } from "buffer"
import nacl from "tweetnacl"

export function useParseConnection() {
  const [params] = useSearchParams()
  let address, petraPublicEncryptedKey, sharedSecret
  if (params.get("tgWebAppStartParam")) {
    const parsed = params.get("tgWebAppStartParam")?.split("_")
    if (parsed?.[1]) {
      try {
        const data = JSON.parse(atob(parsed?.[1] || ""))
        address = data.address
        petraPublicEncryptedKey = nacl.box.before(
          Buffer.from(data.petraPublicEncryptedKey.slice(2), "hex"),
          bs58.decode(import.meta.env.VITE_DAPP_PRIVATE_KEY),
        )
        sharedSecret = petraPublicEncryptedKey
        if (parsed?.[0] === "connect") {
          localStorage.setItem("anqa_shared_secret", bs58.encode(petraPublicEncryptedKey))
          localStorage.setItem("anqa_address", address || "")
        } else {
          sharedSecret = bs58.decode(localStorage.getItem("anqa_shared_secret") || "")
          address = localStorage.getItem("anqa_address")
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      sharedSecret = bs58.decode(localStorage.getItem("anqa_shared_secret") || "")
      address = localStorage.getItem("anqa_address")
    }
  } else {
    sharedSecret = bs58.decode(localStorage.getItem("anqa_shared_secret") || "")
    address = localStorage.getItem("anqa_address")
  }
  return {
    address,
    sharedSecret,
  }
}
