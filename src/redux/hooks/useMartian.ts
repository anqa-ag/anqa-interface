import { useCallback } from "react"
import { useAppDispatch } from "."
import { martian } from "../../../global"
import { connect, disconnect } from "../slices/wallet"

export default function useMartian() {
  const dispatch = useAppDispatch()

  const onConnect = useCallback(async () => {
    if (!martian) {
      dispatch(disconnect())
      window.open("https://www.martianwallet.xyz/", "_blank")
      return
    }

    try {
      const response = await martian.connect()
      const network = await martian.network()
      dispatch(connect({ network, walletAddress: response.address }))
      return true
    } catch (err) {
      dispatch(disconnect())
      throw err
    }

  }, [dispatch])

  const onDisconnect = useCallback(async () => {
    if (!martian) return

    await martian.disconnect()
    dispatch(disconnect())
  }, [dispatch])

  return { onConnect, onDisconnect }
}
