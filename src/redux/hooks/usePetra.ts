import { useCallback } from "react"
import { useAppDispatch } from "."
import { connect, disconnect } from "../slices/wallet"
import { isDesktop } from "react-device-detect"
import { petra } from "../../../types/common"

export default function usePetra() {
  const dispatch = useAppDispatch()

  const onConnect = useCallback(async () => {
    if (!petra) {
      dispatch(disconnect())
      if (isDesktop) {
        window.open("https://petra.app", "_blank")
      } else {
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
