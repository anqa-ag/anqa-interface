import { Button, Image, Spacer } from "@nextui-org/react"
import { ArrowFilledDownIcon, SettingIcon, SwapIcon, WalletIcon } from "./components/Icons"
import { BodyB2, BodyB3, TitleT1, TitleT2 } from "./components/Texts"

const NumberInput = () => {
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

const NumberInput2 = () => {
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

export default function App() {
  return (
    <main className="bg-background text-foreground dark">
      <div className="h-lvh w-lvw overflow-hidden">
        <div className="absolute h-lvh w-lvw bg-[url('/images/background.svg')] bg-cover bg-bottom bg-no-repeat opacity-40" />
        <div className="isolate">
          {/*
###############################################################################
#
#                                                                        HEADER
#
###############################################################################
*/}
          <header className="flex h-[84px] content-center items-center justify-between px-[60px]">
            <div className="flex-1">
              <Button isIconOnly variant="light" className="h-[48px] w-[48px]">
                <Image width={60} src="/favicon.png" />
              </Button>
            </div>
            <div className="flex gap-4">
              <Button variant="light" className="px-4">
                <TitleT1 className="text-primaryHover">Trade</TitleT1>
              </Button>
              <Button variant="light" className="px-4" disabled>
                <TitleT1 className="text-disable">Bridge (soon)</TitleT1>
              </Button>
            </div>
            <div className="flex-1 text-end">
              <Button color="primary" className="rounded">
                <TitleT2>Connect Wallet</TitleT2>
              </Button>
            </div>
          </header>
          {/*
###############################################################################
#
#                                                                          MAIN
#
###############################################################################
*/}
          <div className="mt-[60px] w-full">
            <div className="mx-auto flex max-w-[420px] flex-col">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Button
                    className="h-[36px] min-w-min gap-1 rounded bg-primaryHover p-2"
                    endContent={<SwapIcon size={16} />}
                  >
                    <TitleT2 className="text-black">Swap</TitleT2>
                  </Button>
                </div>
                <Button isIconOnly variant="light" className="h-[36px] w-[36px] min-w-min">
                  <SettingIcon size={36} />
                </Button>
              </div>

              <Spacer y={4} />

              <div className="relative flex flex-col gap-1">
                <NumberInput />
                <div className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2">
                  <Button
                    isIconOnly
                    className="rounded-full border-2 border-background bg-buttonDisabled data-[hover]:border-buttonSecondary"
                  >
                    <SwapIcon size={24} color="#FFFFFF" />
                  </Button>
                </div>
                <NumberInput2 />
              </div>

              <Spacer y={3} />

              <div className="anqa-hover-primary-all flex cursor-pointer items-center gap-3" tabIndex={0}>
                <BodyB2 className="rounded border-1 border-primary p-2 text-primary">2 splits & 3 hops</BodyB2>
                <BodyB3 className="text-buttonSecondary">via Pancakeswap, Cellana, Liquidswap</BodyB3>
                <ArrowFilledDownIcon size={24} className="ml-auto -rotate-90" color="#9AA0A6" />
              </div>

              <Spacer y={3} />

              <Button color="primary" className="h-[44px] rounded">
                <TitleT2>Swap</TitleT2>
              </Button>
            </div>
          </div>

          {/*
###############################################################################
#
#                                                                        FOOTER
#
###############################################################################
*/}
        </div>
      </div>
    </main>
  )
}
