import { Tooltip as ReactTooltip } from 'react-tooltip'

export default function Tooltips() {
  return (
    <>
      <ReactTooltip
        id="tooltip-price-impact"
        variant="dark"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
        delayShow={0}
        content="Estimated change in price due to the size of your transaction."
      />
      <ReactTooltip
        id="tooltip-minimum-received"
        variant="dark"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
        delayShow={0}
        content="Minimum received amount after slippage. Minimum received amount after slippage."
      />
      <ReactTooltip
        id="tooltip-input-amount-out"
        variant="dark"
        place="left"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
        delayShow={1000}
        content="We only support type amount in."
      />
      <ReactTooltip
        id="tooltip-max-slippage"
        variant="dark"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
        delayShow={0}
        content="If the price changes by more than the designated slippage during your swap, your transaction will be reverted."
      />
    </>
  )
}
