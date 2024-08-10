import { Image, Link } from '@nextui-org/react'

export default function HowToEarnExp() {
  return (
    <div className="w-fit text-white">
      <Image removeWrapper width={423} src={'/images/howtoearn.png'} className="static" />
      <div className="absolute top-16 pl-7 xl:top-12 xl:pl-5">
        <div className="mb-3.5 font-clashDisplayBold text-4xl xl:mb-2 xl:text-2xl">How to earn EXP?</div>
        <div className="mb-1.5 h-fit  w-fit rounded-md bg-[#2667FE] px-2.5 py-1 font-clashDisplayMedium text-base xl:px-1.5 xl:py-0.5">
          $1 in volume = 1 EXP
        </div>
        <Link
          disableAnimation
          href="https://anqaapt.substack.com/p/introducing-the-nest-a-sublime-gamified"
          color="primary"
          className="text-buttonSecondary"
          size="sm"
          isExternal
          showAnchorIcon={false}
        >
          <div className="font-clashDisplayMedium text-base text-buttonSecondary underline">Details</div>
        </Link>
      </div>
    </div>
  )
}
