import { Tooltip as ReactTooltip } from "react-tooltip"

export default function Tooltips() {
  return (
    <>
      <ReactTooltip
        id="tooltip-price-impact"
        content="Estimated change in price due to the size of your transaction."
        variant="light"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
      />
      <ReactTooltip
        id="tooltip-minimum-receive"
        content="Minimum receive amount after slippage."
        variant="light"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
      />
      <ReactTooltip
        id="tooltip-estimated-gas-fee"
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        variant="light"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
      />
      <ReactTooltip
        id="tooltip-estimated-gas-fee-value"
        variant="light"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
      />
    </>
  )
}
