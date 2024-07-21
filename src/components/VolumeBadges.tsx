import Rank from "./Rank.tsx"

export default function VolumeBadges() {
  return (
    <div
      className="relative grid w-full items-center justify-center rounded-xl sm:rounded-none border-1 border-[#0165A3] bg-[radial-gradient(132.5%_219.17%_at_80.49%_128.61%,#2667FE_0%,#0041DA_9.72%,#030181_21.71%,#001343_36.96%,#000000_69.59%)] px-10 py-8 text-white xl:px-8 xl:py-6 sm:py-2.5 sm:px-2">
      <div className="mb-7 sm:mb-2 flex gap-5 xl:gap-2">
        <Rank image="/images/plankton.png" name="Plankton" minimumExp={100} />
        <Rank image="/images/fish.png" name="Fish" minimumExp={500} />
        <Rank image="/images/dolphin.png" name="Dolphin" minimumExp={1500} />
        <Rank image="/images/whale.png" name="Whale" minimumExp={12000} />
        <Rank image="/images/megawhale.png" name="Mega Whale" minimumExp={120000} />
      </div>
      <div className="flex items-center gap-8 sm:gap-6 justify-self-start xl:gap-6 lg:gap-4 ">
        <div className="font-clashDisplayBold sm:font-clashDisplayMedium sm:text-[12px] text-4xl xl:text-2xl">Volume Badges</div>
        <div className="max-w-[600px] sm:max-w-[200px] flex-auto font-clashDisplayMedium text-base sm:text-[7px] text-buttonSecondary sm:leading-[8px]">
          Swap and unlock exclusive Anqa Badges. Each badge celebrates your trading achievements and enhances your
          profile. Keep swapping to collect them all!
        </div>
      </div>
    </div>
  )
}
