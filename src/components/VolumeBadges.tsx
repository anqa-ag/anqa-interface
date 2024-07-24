import Rank from "./Rank.tsx"
import { Fraction } from "../utils/fraction.ts"

interface BadgeConfig {
  imageUrl: string
  name: string
  expLevels: Fraction[]
}

const badgeConfigs: BadgeConfig[] = [
  {
    imageUrl: "/images/plankton.png",
    name: "Plankton",
    expLevels: [
      new Fraction(100),
      new Fraction(200),
      new Fraction(300)
    ]
  },
  {
    imageUrl: "/images/fish.png",
    name: "Fish",
    expLevels: [
      new Fraction(500),
      new Fraction(700),
      new Fraction(1000)
    ]
  },
  {
    imageUrl: "/images/dolphin.png",
    name: "Dolphin",
    expLevels: [
      new Fraction(1500),
      new Fraction(5000),
      new Fraction(10000)
    ]
  },
  {
    imageUrl: "/images/whale.png",
    name: "Whale",
    expLevels: [
      new Fraction(12000),
      new Fraction(50000),
      new Fraction(100000)
    ]
  },
  {
    imageUrl: "/images/megawhale.png",
    name: "Mega Whale",
    expLevels: [
      new Fraction(120000),
      new Fraction(300000),
      new Fraction(500000)
    ]
  }
]

export default function VolumeBadges({ totalExp }: { totalExp: Fraction }) {
  return (
    <div
      className="relative grid w-full items-center justify-center rounded-xl sm:rounded-none border-1 border-[#0165A3] bg-[radial-gradient(132.5%_219.17%_at_80.49%_128.61%,#2667FE_0%,#0041DA_9.72%,#030181_21.71%,#001343_36.96%,#000000_69.59%)] px-10 py-8 text-white xl:px-8 xl:py-6 sm:py-2.5 sm:px-2">
      <div className="mb-7 sm:mb-2 flex gap-5 xl:gap-2">
        {badgeConfigs.map((value) => (
          <Rank key={`rank-${value.name}`} image={value.imageUrl} name={value.name} totalPoint={totalExp}
                expLevels={value.expLevels} />
        ))}
      </div>
      <div className="flex items-center gap-8 sm:gap-6 justify-self-start xl:gap-6 lg:gap-4 ">
        <div className="font-clashDisplayBold sm:font-clashDisplayMedium sm:text-[12px] text-4xl xl:text-2xl">
          Volume Badges
        </div>
        <div
          className="max-w-[600px] sm:max-w-[200px] flex-auto font-clashDisplayMedium text-base sm:text-[7px] text-buttonSecondary sm:leading-[8px]">
          Swap and unlock exclusive Anqa Badges. Each badge celebrates your trading achievements and enhances your
          profile. Keep swapping to collect them all!
        </div>
      </div>
    </div>
  )
}
