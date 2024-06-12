import { useEffect } from "react"
import { VERSION } from "../../constants"
import { useAppSelector } from "../hooks"
import { persistor } from "../store"
import PriceUpdater from "./PriceUpdater"
import TokenUpdater from "./TokenUpdater"
import WalletUpdater from "./WalletUpdater"

export default function Updaters() {
  const version = useAppSelector((state) => state.user.version)
  useEffect(() => {
    if (version !== VERSION) void persistor.purge()
  }, [version])

  return (
    <>
      <WalletUpdater />
      <TokenUpdater />
      <PriceUpdater />
    </>
  )
}
