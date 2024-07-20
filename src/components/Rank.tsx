import { Image } from "@nextui-org/react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import { Icon } from "@iconify/react"
import { useIsSm } from "../hooks/useMedia.ts"

export default function Rank({ image, name, minimumExp }: {
  image: string;
  name: string;
  minimumExp: number
}) {
  const isSm = useIsSm()
  return (
    <div className="flex flex-col items-center rounded-xl bg-[#00123A] p-6 xl:p-4 sm:p-1.5">
      <Image width={isSm ? 48 : 135} src={image} />
      <Image src={"/images/starrank.png"} />
      <div className="flex items-center">
        <div className="mr-1.5 font-clashDisplay text-base sm:text-[7px] font-bold text-white">{name}</div>
        <Icon width={isSm ? 8 : 18} icon="material-symbols:info-outline" color="#9AA0A6"
          data-tooltip-id={`tooltip-badge-${name}`} />
      </div>
      <ReactTooltip
        id={`tooltip-badge-${name}`}
        content={`Minimum ${minimumExp} EXP`}
        variant="dark"
        place="right"
        className="!max-w-[min(320px,80%)] !px-2 !py-1"
        opacity={1}
      />
    </div>
  )
}
