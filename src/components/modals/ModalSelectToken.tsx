import { Icon } from "@iconify/react"
import { Button, Image, Input, Modal, ModalContent, Spacer } from "@nextui-org/react"
import { CSSProperties, memo, useCallback, useEffect, useMemo, useState } from "react"
import { FixedSizeList } from "react-window"
import { useCopyToClipboard, useDebounceValue, useWindowSize } from "usehooks-ts"
import { NOT_FOUND_TOKEN_LOGO_URL } from "../../constants"
import { useIsSm } from "../../hooks/useMedia"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { Token, addTokensToFollow } from "../../redux/slices/token"
import { Fraction } from "../../utils/fraction"
import { divpowToFraction, mulpowToFraction } from "../../utils/number"
import { CloseIcon, SearchIcon } from "../Icons"
import { BodyB3, TitleT1, TitleT2, TitleT5 } from "../Texts"

export interface TokenWithBalance extends Token {
  fractionalBalance?: Fraction
  fractionalBalanceUsd?: Fraction
}

function TokenItem({
  index,
  data: { items, setToken, onCopy, copiedId, isCopying },
  style,
}: {
  index: number
  data: {
    items: TokenWithBalance[]
    setToken: (id: string) => void
    onCopy: (id: string) => void
    copiedId: string | null
    isCopying: boolean
  }
  style: CSSProperties
}) {
  const token = useMemo(() => {
    return items[index]
  }, [items, index])
  const [src, setSrc] = useState(token.logoUrl || NOT_FOUND_TOKEN_LOGO_URL)

  useEffect(() => {
    setSrc(token.logoUrl || NOT_FOUND_TOKEN_LOGO_URL)
  }, [index, items, onCopy, token.logoUrl])

  const isCopyingThisToken = useMemo(
    () => isCopying && copiedId === items[index].id,
    [copiedId, index, isCopying, items],
  )

  return (
    <div
      className="flex h-fit w-full cursor-pointer items-center gap-2 rounded-none bg-buttonDisabled px-4 py-3 font-normal hover:bg-background"
      tabIndex={0}
      style={style}
      onClick={() => setToken(items[index].id)}
    >
      <Image
        width={20}
        height={20}
        src={src}
        onError={() => setSrc(NOT_FOUND_TOKEN_LOGO_URL)}
        className="flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] rounded-full bg-white"
        disableSkeleton
      />
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        <div className="flex items-baseline gap-1">
          <TitleT2 className="">{token.symbol}</TitleT2>
          <Button
            variant="light"
            className="h-fit w-fit min-w-fit gap-1 self-center rounded-none p-0 font-normal data-[hover]:bg-transparent"
            onPress={() => onCopy(items[index].id)}
            disableAnimation
            disableRipple
          >
            {isCopyingThisToken ? (
              <>
                <TitleT5
                  className="overflow-hidden text-ellipsis whitespace-nowrap pt-1 text-tooltipBg"
                  onClick={() => onCopy(items[index].id)}
                >
                  {token.id.slice(0, 10) + "..."}
                </TitleT5>
                <Icon icon="material-symbols:check" fontSize={16} className="text-tooltipBg" />
              </>
            ) : (
              <>
                <TitleT5
                  className="overflow-hidden text-ellipsis whitespace-nowrap pt-1 text-tooltipBg"
                  onClick={() => onCopy(items[index].id)}
                >
                  {token.id.slice(0, 10) + "..."}
                </TitleT5>
                <Icon icon="ph:copy" fontSize={16} className="text-tooltipBg" />
              </>
            )}
          </Button>
        </div>
        <TitleT5 className="w-full flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start text-tooltipBg">
          {token.name}
        </TitleT5>
      </div>
      <div className="flex flex-col items-end gap-1 justify-self-end">
        <TitleT5 className="text-tooltipBg">
          {items[index].fractionalBalance ? items[index].fractionalBalance?.toSignificant(6) : undefined}
        </TitleT5>
        <BodyB3 className="text-tooltipBg">
          {items[index].fractionalBalanceUsd ? `~$${items[index].fractionalBalanceUsd?.toSignificant(6)}` : undefined}
        </BodyB3>
      </div>
    </div>
  )
}

function ModalSelectToken({
  isOpen,
  onClose,
  onOpenChange,
  setToken,
}: {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
  setToken: (id: string) => void
}) {
  const dispatch = useAppDispatch()

  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
  const followingPriceData = useAppSelector((state) => state.price.followingPriceData)
  const { balance, walletAddress } = useAppSelector((state) => state.wallet)
  const followingTokenDataWithBalance = useMemo(() => {
    const res: Record<string, TokenWithBalance> = {}
    for (const address of Object.keys(followingTokenData)) {
      let fractionalBalance: Fraction | undefined
      if (walletAddress && balance[address] && balance[address]?.amount) {
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
  }, [balance, followingPriceData, followingTokenData, walletAddress])
  const followingTokenDataWithBalanceList = useMemo(() => {
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
  }, [followingTokenDataWithBalance])

  const isSm = useIsSm()

  const setTokenAndClose = useCallback(
    (id: string) => {
      setToken(id)
      onClose()
    },
    [onClose, setToken],
  )

  const [copiedId, copy] = useCopyToClipboard()
  const [isCopying, setIsCopying] = useState(false)
  const onCopy = useCallback(
    async (id: string) => {
      try {
        setIsCopying(true)
        await copy(id)
        await new Promise((resolve) => setTimeout(resolve, 500))
      } finally {
        setIsCopying(false)
      }
    },
    [copy],
  )

  const [_searchValue, setSearchValue] = useState("")
  const [searchValue] = useDebounceValue(_searchValue, 250)
  const renderTokenList = useMemo(() => {
    const str = searchValue.trim()
    if (!str) return followingTokenDataWithBalanceList

    if (str.includes("::")) {
      dispatch(addTokensToFollow([str]))
    }

    const res = followingTokenDataWithBalanceList.filter((token) => {
      if (token.id === str) return true
      if (token.name.toLowerCase().includes(str.toLowerCase())) return true
      if (token.symbol.toLowerCase().includes(str.toLowerCase())) return true
      return false
    })
    return res
  }, [dispatch, followingTokenDataWithBalanceList, searchValue])
  const isEmpty = renderTokenList.length === 0

  const itemData = useMemo(
    () => ({ items: renderTokenList, setToken: setTokenAndClose, onCopy, copiedId, isCopying }),
    [copiedId, isCopying, onCopy, renderTokenList, setTokenAndClose],
  )

  const { height: windowHeight } = useWindowSize()
  const listHeight = useMemo(() => Math.min(680, Math.round(windowHeight / 2 / 68) * 68), [windowHeight])

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
        <ModalContent className="max-w-[420px] bg-buttonDisabled p-4 pb-0 text-foreground dark">
          {(onClose) => (
            <>
              <div className="flex items-center justify-between">
                <TitleT1>Select a token</TitleT1>
                <Button isIconOnly variant="light" className="h-[20px] w-[20px] min-w-fit p-0" onPress={onClose}>
                  <CloseIcon size={20} />
                </Button>
              </div>

              <Spacer y={4} />

              <Input
                type="text"
                placeholder={isSm ? "Token name, symbol or address" : "Search by token name, symbol or address"}
                labelPlacement="outside"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="input-modal-select-token"
                startContent={<SearchIcon size={20} />}
                value={_searchValue}
                onChange={(e) => setSearchValue(e.currentTarget.value)}
              />

              <Spacer y={4} />

              {renderTokenList && (
                <div className="relative -mx-4">
                  <FixedSizeList
                    height={listHeight}
                    itemCount={renderTokenList.length}
                    itemSize={68}
                    width="100%"
                    itemData={itemData}
                  >
                    {TokenItem}
                  </FixedSizeList>
                  {isEmpty && (
                    <TitleT2 className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 text-buttonSecondary">
                      No Token Found
                    </TitleT2>
                  )}
                </div>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

const MemorizedModalSelectToken = memo(ModalSelectToken)
export default MemorizedModalSelectToken
