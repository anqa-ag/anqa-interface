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
        window.open("https://petra.app/api/v1/connect?data=ewogICJhcHBJbmZvIjogewogICAgImRvbWFpbiI6ICJhbnFhLWludGVyZmFjZS52ZXJjZWwuYXBwIgogIH0sCiAgInJlZGlyZWN0TGluayI6ICJodHRwczovL2FucWEtaW50ZXJmYWNlLnZlcmNlbC5hcHAiLAogICJkYXBwRW5jcnlwdGlvblB1YmxpY0tleSI6ICIiCn0=")
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
