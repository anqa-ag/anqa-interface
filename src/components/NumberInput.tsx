import { APTOS_COIN, MoveStructId } from "@aptos-labs/ts-sdk"
import { Button, Image } from "@nextui-org/react"
import { useAppSelector } from "../redux/hooks"
import { ArrowFilledDownIcon, WalletIcon } from "./Icons"
import { BodyB2, TitleT1 } from "./Texts"
import { toFraction } from "../utils/number"
import { TOKEN_LIST } from "../constants"

export const NumberInput = () => {
  const { walletAddress, balance } = useAppSelector((state) => state.wallet)
  const balanceAPT = balance[APTOS_COIN]
  const fractionalBalanceAPT = balanceAPT
    ? toFraction(balanceAPT.amount, balanceAPT.metadata?.decimals ?? 8)
    : undefined
  return (
    <>
      <div className="flex flex-col gap-2 rounded border-1 border-buttonDisabled bg-buttonDisabled p-3 transition focus-within:border-buttonSecondary">
        <div className="flex items-center justify-between">
          <BodyB2 className="text-buttonSecondary">You get</BodyB2>
          {walletAddress && (
            <Button
              className="anqa-hover-white-all flex h-fit w-fit min-w-fit items-center gap-1 bg-transparent p-0"
              disableAnimation
              disableRipple
            >
              <WalletIcon size={24} />
              <BodyB2 className="text-buttonSecondary">{fractionalBalanceAPT?.toSignificant(6) ?? "--"}</BodyB2>
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            className="w-full bg-transparent text-[36px] font-semibold outline-none placeholder:text-buttonSecondary"
            defaultValue="1.16507965"
            placeholder="0.00"
            inputMode="decimal"
          />
          <Button
            className="flex h-[42px] w-fit min-w-fit items-center gap-1 rounded-full border-1 border-buttonDisabled bg-transparent p-2 transition hover:border-buttonSecondary data-[hover]:bg-transparent"
            disableAnimation
            disableRipple
          >
            <Image
              width={20}
              height={20}
              className="min-h-[20px] min-w-[20px]"
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png"
            />
            <TitleT1 className="whitespace-nowrap">APT</TitleT1>
            <ArrowFilledDownIcon size={20} />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <BodyB2 className="text-buttonSecondary">~$10.01</BodyB2>
        </div>
      </div>
    </>
  )
}

export const NumberInput2 = () => {
  const { walletAddress, balance } = useAppSelector((state) => state.wallet)
  const balanceUSDC = balance[TOKEN_LIST.USDC_LAYERZERO as MoveStructId]
  const fractionalBalanceUSDC = balanceUSDC
    ? toFraction(balanceUSDC.amount, balanceUSDC.metadata?.decimals ?? 8)
    : undefined
  return (
    <>
      <div className="flex flex-col gap-2 rounded border-1 border-buttonDisabled bg-buttonDisabled p-3 transition focus-within:border-buttonSecondary">
        <div className="flex items-center justify-between">
          <BodyB2 className="text-buttonSecondary">You pay</BodyB2>
          {walletAddress && (
            <Button
              className="anqa-hover-white-all flex h-fit w-fit min-w-fit items-center gap-1 bg-transparent p-0"
              disableAnimation
              disableRipple
            >
              <WalletIcon size={24} />
              <BodyB2 className="text-buttonSecondary">{fractionalBalanceUSDC?.toSignificant(6) ?? "--"}</BodyB2>
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            className="w-full bg-transparent text-[36px] font-semibold outline-none placeholder:text-buttonSecondary"
            defaultValue="10"
            placeholder="0.00"
            inputMode="decimal"
          />
          <Button
            className="flex h-[42px] w-fit min-w-fit items-center gap-1 rounded-full border-1 border-buttonDisabled bg-transparent p-2 transition hover:border-buttonSecondary data-[hover]:bg-transparent"
            disableAnimation
            disableRipple
          >
            <Image
              width={20}
              height={20}
              className="min-h-[20px] min-w-[20px]"
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
            />
            <TitleT1 className="whitespace-nowrap">USDC</TitleT1>
            <ArrowFilledDownIcon size={20} />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <BodyB2 className="text-buttonSecondary">~$9.98</BodyB2>
        </div>
      </div>
    </>
  )
}
