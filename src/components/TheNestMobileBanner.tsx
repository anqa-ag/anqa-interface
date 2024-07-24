import { Image, Link } from "@nextui-org/react"
import { TouchEvent, useState } from "react"
import { TitleT1 } from "./Texts.tsx"

export default function TheNestMobileBanner() {
  const items = [<SeasonBanner key="season-banner" />, <HowToEarnExpBanner key="how-to-earn-exp-banner" />]
  const [index, setIndex] = useState(0)

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      setIndex((prevState) => (prevState + 1) % items.length)
    }
    if (isRightSwipe) {
      setIndex((prevState) => (prevState >= 1 ? prevState - 1 : items.length - 1))
    }
  }

  return (
    <div
      className="relative flex h-fit w-full items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {items.map((value, idx) => (
        <div key={"banner-" + idx} className={idx != index ? "hidden" : ""}>
          {value}
        </div>
      ))}
      <span className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 gap-1 ">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={
              "h-1.5 w-1.5 rounded-full border-none bg-white outline-none " + (idx != index ? "opacity-50" : "")
            }
          />
        ))}
      </span>
    </div>
  )
}

function SeasonBanner() {
  return (
    <div className="relative text-white">
      <Image width="100%" src={"/images/the_nest_mobile_banner_1.png"} className="static" radius="none" />
      <div className="absolute left-5 top-1/2 flex -translate-y-1/2 items-center">
        <TitleT1 className="mr-3 font-clashDisplayBold">Season I</TitleT1>
      </div>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
        <div className="rounded-md bg-[#2667FE] px-1.5 py-1 font-clashDisplay text-[10px] ">
          00:00 UTC Jan 01 - 2024 <br />
          -00:00 UTC Mar 01- 2024
        </div>
      </div>
    </div>
  )
}

function HowToEarnExpBanner() {
  return (
    <div className="relative text-white" key="banner-2">
      <Image width="100%" src={"/images/the_nest_mobile_banner_2.png"} className="static" />
      <div className="absolute left-6 top-4 flex flex-col items-start">
        <TitleT1 className="font-clashDisplayBold leading-6">How to earn EXP?</TitleT1>
        <Link
          disableAnimation
          href="https://anqaapt.substack.com/p/introducing-the-nest-a-sublime-gamified"
          color="primary"
          className="text-buttonSecondary"
          size="sm"
          isExternal
          showAnchorIcon={false}
        >
          <div className="font-clashDisplayMedium text-base text-buttonSecondary">Details</div>
        </Link>
      </div>
    </div>
  )
}
