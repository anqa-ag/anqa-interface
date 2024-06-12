import { memo, useEffect } from "react"
import useTokenPrice from "../../hooks/useTokenPrice"
import { useAppDispatch, useAppSelector } from "../hooks"
import { updatePriceData } from "../slices/price"

function PriceUpdater() {
  const dispatch = useAppDispatch()

  const followingTokenAddresses = useAppSelector((state) => state.token.followingTokenAddresses)

  const { tokenPriceMap } = useTokenPrice(followingTokenAddresses)
  useEffect(() => {
    if (tokenPriceMap) {
      const newPriceData: Record<string, string> = {}
      for (const address of Object.keys(tokenPriceMap)) {
        newPriceData[address] = tokenPriceMap[address].price
      }
      dispatch(updatePriceData(newPriceData))
    }
  }, [dispatch, tokenPriceMap])

  return null
}

const MemoPriceUpdater = memo(PriceUpdater)
export default MemoPriceUpdater
