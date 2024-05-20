import { Tooltip as ReactTooltip } from "react-tooltip"

export default function Tooltips() {
  return (
    <>
      <ReactTooltip
        id="tooltip-price-impact"
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        variant="light"
        place="right"
        className="!max-w-[min(420px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
      />
      <ReactTooltip
        id="tooltip-minimum-receive"
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        variant="light"
        place="right"
        className="!max-w-[min(420px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
      />
      <ReactTooltip
        id="tooltip-max-tx-fee"
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        variant="light"
        place="right"
        className="!max-w-[min(420px,80%)] !px-2 !py-1 !text-sm"
        opacity={1}
      />
    </>
  )
}
