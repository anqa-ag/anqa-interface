import { useState } from "react"

export default function useTooltip() {
  const [{ tooltipPriceImpact, tooltipMinimumReceive, tooltipMaxTxFee }, _setTooltip] = useState({
    tooltipPriceImpact: false,
    tooltipMinimumReceive: false,
    tooltipMaxTxFee: false,
  })

  const setTooltip = (name: string) => (value: boolean) => {
    _setTooltip((prev) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.keys(prev).forEach((v) => (prev[v] = false))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      prev[name] = value
      return { ...prev }
    })
  }

  return {
    tooltipPriceImpact,
    setTooltipPriceImpact: setTooltip("tooltipPriceImpact"),

    tooltipMinimumReceive,
    setTooltipMinimumReceive: setTooltip("tooltipMinimumReceive"),

    tooltipMaxTxFee,
    setTooltipMaxTxFee: setTooltip("tooltipMaxTxFee"),
  }
}
