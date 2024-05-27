import WalletUpdater from "./WalletUpdater"
import TokenUpdater from "./TokenUpdater"
import PriceUpdater from "./PriceUpdater"

export default function Updaters() {
  return (
    <>
      <WalletUpdater />
      <TokenUpdater />
      <PriceUpdater />
    </>
  )
}
