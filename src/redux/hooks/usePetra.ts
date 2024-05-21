import { useCallback } from "react"
import { useAppDispatch } from "."
import { petra } from "../../../global"
import { connect, disconnect } from "../slices/wallet"
import { isDesktop } from "react-device-detect"

export default function usePetra() {
  const dispatch = useAppDispatch()

  const onConnect = useCallback(async () => {
    if (!petra) {
      if (isDesktop) {
        window.open("https://petra.app", "_blank")
      } else {
        // https://petra.app/docs/mobile-deeplinks#dappencryptionpublickey
        // Pubkey = MCowBQYDK2VuAyEAwSqcUx+QSUYXFB9X7qVQjYjvxq8K3/jid6iZfH/XNSQ=
        // Pubkey in hex = 4d436f77425159444b325675417945417753716355782b515355595846423958377156516a596a767871384b332f6a696436695a66482f584e53513d
        // {
        //   "appInfo": {
        //     "domain": "anqa-interface.vercel.app"
        //   },
        //   "redirectLink": "https://anqa-interface.vercel.app",
        //   "dappEncryptionPublicKey": "4d436f77425159444b325675417945417753716355782b515355595846423958377156516a596a767871384b332f6a696436695a66482f584e53513d"
        // }
        window.open("https://petra.app/explore?link=https://anqa-interface.vercel.app")
      }
      return
    }

    try {
      const response = await petra.connect()
      const network = await petra.network()
      dispatch(connect({ network, walletAddress: response.address }))
      return true
    } catch (err) {
      dispatch(disconnect())
      throw err
    }
  }, [dispatch])

  const onDisconnect = useCallback(async () => {
    if (!petra) return

    await petra.disconnect()
    dispatch(disconnect())
  }, [dispatch])

  return { onConnect, onDisconnect }
}
