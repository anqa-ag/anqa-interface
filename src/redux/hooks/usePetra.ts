import { useCallback } from "react"
import { useAppDispatch } from "."
import { petra } from "../../../global"
import { connect, disconnect } from "../slices/wallet"

export default function usePetra() {
  const dispatch = useAppDispatch()

  const onConnect = useCallback(async () => {
    if (!petra) {
      window.open("https://petra.app", "_blank")
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
