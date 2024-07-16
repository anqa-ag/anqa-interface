import { TitleT1 } from "./Texts.tsx"
import { Image } from "@nextui-org/react"

export default function YourTotalExp({ totalExp }: { totalExp: number }) {
  return (
    <div className="relative mt-11 flex w-fit flex-col items-center rounded-xl border-1 border-[#0165A3] bg-[radial-gradient(117.65%_184.85%_at_117.65%_149.34%,#2667FE_0%,#0041DA_9.72%,#030181_21.71%,#001343_36.96%,#000000_69.59%)] px-2.5 pt-[60px] xl:mt-9">
      <TitleT1 className="mr-1 p-2.5 font-ClassDisplayMedium">Your Total EXP</TitleT1>
      <div className="mb-7 flex h-fit min-w-[200px] items-center justify-center gap-2.5 rounded-3xl bg-[#2B313D] px-6 py-2.5">
        <Image height={41} src={"/images/coin.png"} />
        <div className="font-ClassDisplayBold text-4xl xl:text-2xl">{totalExp.toLocaleString()}</div>
      </div>
      <Image src={"/images/questionbox.png"} width={350} className="mb-8" />
      <div className="2xl:font-ClassDisplayMedium 2xl:text-xl xl:font-ClassDisplay xl:text-lg">
        Earn More EXP to unlock
      </div>
      <div className="2xl:font-ClassDisplayMedium 2xl:text-xl xl:font-ClassDisplay xl:text-lg">
        The Nest’s Mystery item!
      </div>
    </div>
  )
}
