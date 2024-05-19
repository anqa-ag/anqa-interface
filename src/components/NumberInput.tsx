import { Image } from "@nextui-org/react"
import { BodyB2, TitleT2 } from "./Texts"
import { ArrowFilledDownIcon, WalletIcon } from "./Icons"

export const NumberInput = () => {
  return (
    <div className="flex flex-col gap-2 rounded border-2 border-buttonDisabled bg-buttonDisabled p-3 transition focus-within:border-buttonSecondary">
      <div className="flex items-center justify-between">
        <BodyB2 className="text-buttonSecondary">You pay</BodyB2>
        <div className="anqa-hover-white-all flex cursor-pointer items-center gap-1" tabIndex={0}>
          <WalletIcon size={24} />
          <BodyB2 className="text-buttonSecondary">275.113206</BodyB2>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <input
          type="number"
          className="w-full bg-transparent text-[28px] font-semibold outline-none placeholder:text-buttonSecondary"
          defaultValue="10"
          placeholder="0.00"
          inputMode="decimal"
        />
        <div
          className="flex h-[42px] cursor-pointer items-center gap-1 rounded-full border-2 border-buttonDisabled p-2 transition hover:border-buttonSecondary"
          tabIndex={0}
        >
          <Image
            width={20}
            height={20}
            className="min-h-[20px] min-w-[20px]"
            src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
          />
          <TitleT2 className="whitespace-nowrap">USDC (Wormhole)</TitleT2>
          <ArrowFilledDownIcon size={20} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <BodyB2 className="text-buttonSecondary">~$9.98</BodyB2>
      </div>
    </div>
  )
}

export const NumberInput2 = () => {
  return (
    <div className="flex flex-col gap-2 rounded border-2 border-buttonDisabled bg-buttonDisabled p-3 transition focus-within:border-buttonSecondary">
      <div className="flex items-center justify-between">
        <BodyB2 className="text-buttonSecondary">You get</BodyB2>
        <div className="anqa-hover-white-all flex cursor-pointer items-center gap-1" tabIndex={0}>
          <WalletIcon size={24} />
          <BodyB2 className="text-buttonSecondary">0.095761447</BodyB2>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <input
          type="number"
          className="w-full bg-transparent text-[28px] font-semibold outline-none placeholder:text-buttonSecondary"
          defaultValue="1.16507965"
          placeholder="0.00"
          inputMode="decimal"
        />
        <div
          className="flex h-[42px] cursor-pointer items-center gap-1 rounded-full border-2 border-buttonDisabled p-2 transition hover:border-buttonSecondary"
          tabIndex={0}
        >
          <Image
            width={20}
            height={20}
            className="min-h-[20px] min-w-[20px]"
            src="https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png"
          />
          <TitleT2 className="whitespace-nowrap">APT</TitleT2>
          <ArrowFilledDownIcon size={20} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <BodyB2 className="text-buttonSecondary">~$10.01</BodyB2>
      </div>
    </div>
  )
}
