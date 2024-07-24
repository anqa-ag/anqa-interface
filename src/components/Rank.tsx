import { Image } from "@nextui-org/react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import { Icon } from "@iconify/react"
import { useIsSm } from "../hooks/useMedia.ts"
import { numberWithCommas } from "../utils/number.ts"
import { Fraction } from "../utils/fraction.ts"

export default function Rank({ image, name, expLevels, totalPoint }: {
  image: string;
  name: string;
  expLevels: Fraction[]
  totalPoint: Fraction
}) {
  const isSm = useIsSm()
  return (
    <div className="flex flex-col items-center rounded-xl bg-[#00123A] p-6 xl:p-4 sm:p-1">
      <Image width={isSm ? 48 : 135} src={image} />
      <div className="flex gap-2.5 sm:gap-1 mb-0.5">
        {expLevels.map((value, index) =>
          (<Image key={`star-${name}-${index}`} width={isSm ? 10 : 21}
                  src={!totalPoint.lessThan(value) ? "/images/starenable.png" : "/images/stardisable.png"} />)
        )}
      </div>
      <div className="flex items-center flex-wrap justify-center flex-row">
        <div className="mr-1.5 sm:mr-0.5 font-clashDisplay text-base sm:text-[7px] font-bold text-white">{name}</div>
        <Icon width={isSm ? 8 : 18} icon="material-symbols:info-outline" color="#9AA0A6"
              data-tooltip-id={`tooltip-badge-${name}`} />
      </div>
      <ReactTooltip
        id={`tooltip-badge-${name}`}
        content={`Minimum ${numberWithCommas((expLevels.length > 0 ? expLevels[0] : new Fraction(0)).toSignificant(6), true, 0)} EXP`}
        variant="dark"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1"
        opacity={1}
      />
    </div>
  )
}
