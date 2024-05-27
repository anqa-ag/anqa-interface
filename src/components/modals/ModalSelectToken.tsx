import { Icon } from "@iconify/react"
import { Button, Image, Input, Modal, ModalContent, Spacer } from "@nextui-org/react"
import { CSSProperties, useMemo, useState } from "react"
import { isMobile } from "react-device-detect"
import { FixedSizeList } from "react-window"
import { SearchIcon } from "../Icons"
import { BodyB3, TitleT2, TitleT5 } from "../Texts"
import { useAppSelector } from "../../redux/hooks"
import { Token } from "../../redux/slices/token"
import { Fraction } from "../../utils/fraction"
import { divpowToFraction, mulpowToFraction } from "../../utils/number"

export interface TokenWithBalance extends Token {
  fractionalBalance?: Fraction
  fractionalBalanceUsd?: Fraction
}

function TokenItem({ index, data, style }: { index: number; data: TokenWithBalance[]; style: CSSProperties }) {
  const token = useMemo(() => {
    return data[index]
  }, [data, index])
  const [src, setSrc] = useState(token.logoUrl)
  const onLogoError = () => {
    setSrc(
      "https://png.pngtree.com/png-clipart/20190516/original/pngtree-question-mark-vector-icon-png-image_4236972.jpg",
    )
  }
  return (
    <div
      className="flex h-fit w-full cursor-pointer items-center gap-2 rounded-none bg-buttonDisabled px-4 py-3 font-normal hover:bg-background"
      tabIndex={0}
      style={style}
    >
      <Image
        width={20}
        height={20}
        src={src}
        onError={onLogoError}
        className="flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] rounded-full bg-white"
        disableSkeleton
      />
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        <div className="flex items-baseline gap-1">
          <TitleT2 className="">{token.symbol}</TitleT2>
          <TitleT5 className="text-tooltipBg overflow-hidden text-ellipsis whitespace-nowrap">
            {token.id.slice(0, 10) + "..."}
          </TitleT5>
          <Button
            variant="light"
            isIconOnly
            className="h-fit w-fit min-w-fit self-center p-0 data-[hover]:bg-transparent"
          >
            <Icon icon="ph:copy" fontSize={16} className="text-tooltipBg" />
          </Button>
        </div>
        <TitleT5 className="text-tooltipBg w-full flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start">
          {token.name}
        </TitleT5>
      </div>
      <div className="flex flex-col items-end gap-1 justify-self-end">
        <TitleT5 className="text-tooltipBg">{data[index].fractionalBalance ? data[index].fractionalBalance?.toSignificant(6) : undefined}</TitleT5>
        <BodyB3 className="text-tooltipBg">{data[index].fractionalBalanceUsd ? `~${data[index].fractionalBalanceUsd?.toSignificant(6)}` : undefined}</BodyB3>
      </div>
    </div>
  )
}

export default function ModalSelectToken({
  isOpen,
  // onClose,
  onOpenChange,
}: {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
}) {
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
  const followingPriceData = useAppSelector((state) => state.price.followingPriceData)
  const balance = useAppSelector((state) => state.wallet.balance)
  const followingTokenDataWithBalance = useMemo(() => {
    const res: Record<string, TokenWithBalance> = {}
    for (const address of Object.keys(followingTokenData)) {
      let fractionalBalance: Fraction | undefined
      if (balance[address] && balance[address]?.amount) {
        fractionalBalance = divpowToFraction(balance[address]!.amount, followingTokenData[address].decimals)
      }
      let fractionalBalanceUsd: Fraction | undefined
      if (fractionalBalance && followingPriceData[address]) {
        const fractionalPrice = mulpowToFraction(followingPriceData[address])
        fractionalBalanceUsd = fractionalBalance.multiply(fractionalPrice)
      }
      const newItem: TokenWithBalance = {
        id: followingTokenData[address].id,
        name: followingTokenData[address].name,
        symbol: followingTokenData[address].symbol,
        decimals: followingTokenData[address].decimals,
        logoUrl: followingTokenData[address].logoUrl,
        fractionalBalance,
        fractionalBalanceUsd,
      }
      res[address] = newItem
    }
    return res
  }, [balance, followingPriceData, followingTokenData])
  const followingTokenDataWithBalanceList = useMemo(
    () => {
      const list = Object.values(followingTokenDataWithBalance)
      list.sort((a: TokenWithBalance, b: TokenWithBalance) => {
        const x = a.fractionalBalanceUsd ?? new Fraction(0)
        const y = b.fractionalBalanceUsd ?? new Fraction(0)
        if (x.lessThan(y)) {
          return 1
        } else if (x.greaterThan(y)) {
          return -1
        }
        return a.symbol.localeCompare(b.symbol)
      })
      return list
    },
    [followingTokenDataWithBalance],
  )

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        hideCloseButton
        disableAnimation
      >
        <ModalContent className="max-w-[420px] bg-buttonDisabled p-4 text-foreground dark">
          {(onClose) => (
            <>
              <Input
                type="text"
                placeholder="Enter a token name or an address"
                labelPlacement="outside"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="input-modal-select-token"
                startContent={<SearchIcon size={20} />}
                endContent={
                  <Button
                    className="text-buttonSecondaryHover h-[24px] min-w-fit rounded !bg-buttonDisabled px-2"
                    onPress={onClose}
                  >
                    Esc
                  </Button>
                }
              />

              <Spacer y={4} />

              {followingTokenDataWithBalanceList && (
                <div className="-ml-4 w-[calc(100%_+_32px)]">
                  <FixedSizeList
                    height={isMobile ? 340 : 680}
                    itemCount={followingTokenDataWithBalanceList.length}
                    itemSize={68}
                    width="100%"
                    itemData={followingTokenDataWithBalanceList}
                  >
                    {TokenItem}
                  </FixedSizeList>
                </div>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
