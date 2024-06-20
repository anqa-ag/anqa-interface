import bs58 from "bs58"
import { useSearchParams } from "react-router-dom"

export function useParseConnection() {
  const [params] = useSearchParams()
  let address, sharedSecret
  if (params.get("tgWebAppStartParam")) {
    const parsed = params.get("tgWebAppStartParam")
    try {
      const decodedData = JSON.parse(atob(parsed || ""))
      console.log(`decodedData`, decodedData)
      const method = decodedData.method
      if (method === "connect") {
        address = decodedData.address
        sharedSecret = bs58.decode(decodedData.petraPublicEncryptedKey)
        localStorage.setItem("anqa_shared_secret", bs58.encode(sharedSecret))
        localStorage.setItem("anqa_address", address)
      } else {
        sharedSecret = bs58.decode(localStorage.getItem("anqa_shared_secret") || "")
        address = localStorage.getItem("anqa_address")
      }
    } catch (e) {
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
