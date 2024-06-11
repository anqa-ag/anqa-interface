import WalletUpdater from "./WalletUpdater"
import TokenUpdater from "./TokenUpdater"
import PriceUpdater from "./PriceUpdater"
import { useEffect } from "react"
import { persistor } from "../store"
import { useAppSelector } from "../hooks"
import { VERSION } from "../../constants"

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
