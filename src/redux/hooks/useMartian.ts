import { useAppDispatch } from "."
import { martian } from "../../../global"
import { connect, disconnect } from "../slices/wallet"

export default function useMartian() {
  const dispatch = useAppDispatch()

  const onConnect = async () => {
    if (!martian) return

    const network = await martian.network()
    const response = await martian.connect()
    dispatch(
      connect({
        network,
        walletAddress: response.address,
      }),
    )
  }

  const onDisconnect = async () => {
    if (!martian) return

    await martian.disconnect()
    dispatch(disconnect())
  }

  return { onConnect, onDisconnect }
}
