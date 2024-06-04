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
        id="tooltip-input-amount-out"
        content="We only support type amount in."
        variant="light"
        place="left"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        delayShow={1000}
        opacity={1}
      />
      <ReactTooltip
        id="tooltip-max-slippage"
        content="During your swap if the price changes by more than this slippage, your transaction will revert."
        variant="light"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
        />
    </>
  )
}
