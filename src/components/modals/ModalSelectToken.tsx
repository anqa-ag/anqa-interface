import { Avatar, Button, Chip, Image, Input, Modal, ModalContent, Skeleton, Spacer } from '@nextui-org/react'
import { CSSProperties, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { useDebounceValue, useWindowSize } from 'usehooks-ts'
import useFullTokens from '../../hooks/useFullTokens'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addTokensToFollow, Asset } from '../../redux/slices/asset.ts'
import { Fraction } from '../../utils/fraction'
import { CloseIcon, SearchIcon } from '../Icons'
import { TitleT1, TitleT2 } from '../Texts'
import BasicTokenInfo from '../BasicTokenInfo.tsx'
import { useIsSm } from '../../hooks/useMedia.ts'
import { PartialRecord } from '../../types.ts'
import { calcTotalTokenBalance, sortBalanceFn, useTokensHasBalance } from '../../hooks/useTokenBalance.ts'
import { motion } from 'framer-motion'

const BANNERS = [
  {
    id: '0x5915ae0eae3701833fa02e28bf530bc01ca96a5f010ac8deecb14c7a92661368',
    faAddress: '0x5915ae0eae3701833fa02e28bf530bc01ca96a5f010ac8deecb14c7a92661368',
    coinType: '0x4fbed3f8a3fd8a11081c8b6392152a8b0cb14d70d0414586f0c9b858fcd2d6a7::UPTOS::UPTOS',
    symbol: 'UPTOS',
    name: 'UPTOS',
    decimals: 8,
    whitelisted: false,
    logoUrl: '/banners/UPTOS.jpg',
  },
  {
    id: '0x7fa78d58cccc849363df4ed1acd373b1f09397d1c322450101e3b0a4a7a14d80',
    faAddress: '0x7fa78d58cccc849363df4ed1acd373b1f09397d1c322450101e3b0a4a7a14d80',
    coinType: '0x4ef6d6d174ae393cec4c8af0b75638082fe45c92e552b4df8bc679e3a0ddcb13::CAPTOS::CAPTOS',
    symbol: 'CAPTOS',
    name: 'captos',
    decimals: 6,
    whitelisted: false,
    logoUrl: '/banners/CAPTOS.png',
  },
  {
    id: '0x1ff8bf54987b665fd0aa8b317a22a60f5927675d35021473a85d720e254ed77e',
    faAddress: '0x1ff8bf54987b665fd0aa8b317a22a60f5927675d35021473a85d720e254ed77e',
    coinType: '0x5e975e7f36f2658d4cf146142899c659464a3e0d90f0f4d5f8b2447173c06ef6::EDOG::EDOG',
    symbol: 'EDOG',
    name: 'captos',
    decimals: 6,
    whitelisted: false,
    logoUrl: '/banners/EDOG.png',
  },
]

const STABLE_COIN_IDS = [
  '0x1::aptos_coin::AptosCoin',
  '0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b',
  '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
  '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
  '0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b',
]

export interface TokenWithBalance extends Asset {
  isFollowing: boolean
  faBalance?: Fraction
  faBalanceUsd?: Fraction
  coinBalanceUsd?: Fraction
  coinBalance?: Fraction
}

const itemSize = 80
const itemSizeSmall = 58

function TokenItem({
  index,
  data: { items, onSelectToken, onChangeHeight },
  style,
}: {
  index: number
  data: {
    items: TokenWithBalance[]
    onSelectToken: (id: Asset) => void
    onChangeHeight: (height: number, index: number) => void
  }
  style: CSSProperties
}) {
  const token = useMemo(() => {
    return items[index]!
  }, [items, index])

  const [height, setHeight] = useState(
    token.coinType && !calcTotalTokenBalance(token).totalBalanceUsd.isZero() ? itemSize : itemSizeSmall,
  )
  useEffect(() => {
    onChangeHeight(height, index)
  }, [height, index, onChangeHeight])

  return (
    <motion.div
      animate={{ height }}
      className={
        'm-0 flex h-fit w-full min-w-fit cursor-pointer items-center gap-2 rounded-none p-0 px-4 font-normal hover:bg-baseBlack' +
        ' ' +
        (token.isFollowing ? 'opacity-100' : 'opacity-50')
      }
      style={style}
    >
      <BasicTokenInfo
        onClick={() => onSelectToken(token)}
        token={token}
        onChangeHeight={(expand) => {
          setHeight(expand ? itemSize : itemSizeSmall)
        }}
      />
    </motion.div>
  )
}

function ModalSelectToken({
  isOpen,
  onClose: _onClose,
  onOpenChange: _onOpenChange,
  onSelectToken,
}: {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
  onSelectToken: (id: Asset) => void
}) {
  const dispatch = useAppDispatch()
  const { data: fullTokenData } = useFullTokens()
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
  const tokensHasBalance = useTokensHasBalance()
  const followingTokenDataWithBalance = useMemo(() => {
    const res: PartialRecord<string, TokenWithBalance> = { ...tokensHasBalance }
    for (const assetAddress of Object.keys(followingTokenData)) {
      if (res[assetAddress]) continue
      const tokenData = followingTokenData[assetAddress]!
      if (tokenData.type === 'legacy') continue
      const newItem: TokenWithBalance = {
        ...tokenData,
        isFollowing: true,
      }
      res[assetAddress] = newItem
    }
    return res
  }, [followingTokenData, tokensHasBalance])
  const followingTokenDataWithBalanceList = useMemo(() => {
    const list = Object.values(followingTokenDataWithBalance) as TokenWithBalance[]
    return list.sort(sortBalanceFn)
  }, [followingTokenDataWithBalance])

  const onClose = useCallback(() => {
    setSearchValue('')
    _onClose()
  }, [_onClose])

  const onOpenChange = useCallback(() => {
    setSearchValue('')
    _onOpenChange()
  }, [_onOpenChange])

  const setTokenAndClose = useCallback(
    (token: Asset) => {
      dispatch(addTokensToFollow([token.id]))
      onSelectToken(token)
      onClose()
    },
    [dispatch, onClose, onSelectToken],
  )

  const [_searchValue, setSearchValue] = useState('')
  const [searchValue] = useDebounceValue(_searchValue, 250)
  const renderFollowingTokenList = useMemo(() => {
    const str = searchValue.trim()
    if (!str) return followingTokenDataWithBalanceList

    const res = followingTokenDataWithBalanceList.filter((token) => {
      if (token.id === str) return true
      if (token.symbol.toLowerCase().includes(str.toLowerCase())) return true
      return !!token.displaySymbol?.toLowerCase()?.includes(str.toLowerCase());
    })
    return res
  }, [followingTokenDataWithBalanceList, searchValue])
  const renderUnfollowingTokenList = useMemo(() => {
    if (!fullTokenData) return []

    const str = searchValue.trim()
    if (!str) return []

    const fullTokenDataList = Object.values(fullTokenData) as Asset[]
    const fullTokenList: TokenWithBalance[] = fullTokenDataList
      .filter((token) => {
        if (token.id === str) return true
        if (token.symbol.toLowerCase().includes(str.toLowerCase())) return true
        return !!token.displaySymbol?.toLowerCase()?.includes(str.toLowerCase());
      })
      .filter((token) => !renderFollowingTokenList.map((token) => token.id).includes(token.id))
      .map((token) => ({
        ...token,
        whitelisted: false,
        isFollowing: false,
      }))
      .sort(sortBalanceFn)
    return fullTokenList
  }, [fullTokenData, renderFollowingTokenList, searchValue])
  const renderTokenList = useMemo(
    () => [...renderFollowingTokenList, ...renderUnfollowingTokenList],
    [renderFollowingTokenList, renderUnfollowingTokenList],
  )
  const isEmpty = renderTokenList.length === 0
  const itemRefs = useRef<Record<number, number>>({})
  const listRef = useRef<any>()
  const onChangeHeight = useCallback((height: number, index: number) => {
    itemRefs.current = {
      ...itemRefs.current,
      [index]: height || itemSizeSmall,
    }
    listRef.current?.resetAfterIndex(index)
  }, [])
  const itemData = useMemo(
    () => ({ items: renderTokenList, onSelectToken, onChangeHeight }),
    [renderTokenList, onSelectToken, onChangeHeight],
  )

  const { height: windowHeight } = useWindowSize()
  const listHeight = useMemo(() => Math.min(680, Math.round(windowHeight / 2 / 68) * 68), [windowHeight])
  const isSm = useIsSm()

  const stableCoinTokens = useMemo(
    () =>
      STABLE_COIN_IDS.map((stableCoinId) => {
        if (stableCoinId in followingTokenData) {
          return followingTokenData[stableCoinId]! as Asset
        }
        return null
      }).filter((item): item is Asset => !!item),
    [followingTokenData],
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
        size={isSm ? 'full' : undefined}
      >
        <ModalContent
          className={
            'max-w-[420px] bg-buttonDisabled p-4 pb-0 text-foreground dark' +
            ' ' +
            (isSm ? 'h-fit max-h-[70vh] self-end' : '')
          }
        >
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
              placeholder={'Search by token symbol or address'}
              labelPlacement="outside"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="input-modal-select-token"
              startContent={<SearchIcon size={20} />}
              endContent={
                searchValue ? (
                  <Button
                    isIconOnly
                    className="m-0 h-fit w-fit min-w-fit border-transparent bg-transparent p-0"
                    disableRipple
                    onPress={() => setSearchValue('')}
                  >
                    <CloseIcon size={16} />
                  </Button>
                ) : null
              }
              value={_searchValue}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
            />

            <Spacer y={4} />

            <div className="flex flex-col gap-2">
              {BANNERS.map((item) => (
                <Button key={item.symbol} onPress={() => setTokenAndClose(item)} className="relative rounded p-0">
                  <Skeleton
                    className="absolute left-0 top-0 z-10 h-full w-full rounded"
                    classNames={{
                      base: '!bg-transparent after:!bg-transparent',
                    }}
                  />
                  <Image src={item.logoUrl} className="z-0 w-full" />
                </Button>
              ))}
            </div>

            <Spacer y={4} />
            <div className="grid grid-cols-4 gap-2">
              {stableCoinTokens.map((token) => (
                <Chip
                  key={`stable-coin-${token.displaySymbol ?? token.symbol}`}
                  classNames={{
                    base: 'bg-transparent hover:cursor-pointer border-small border-white/50 rounded-lg max-w-full',
                    content: 'pl-2',
                  }}
                  onClick={() => {
                    setTokenAndClose(token)
                  }}
                  avatar={<Avatar src={token.logoUrl} />}
                >
                  {token.displaySymbol ?? token.symbol}
                </Chip>
              ))}
            </div>
            <Spacer y={4} />

            {renderTokenList && (
              <div className="relative -mx-4 border-t-1 border-t-background">
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
        </ModalContent>
      </Modal>
    </>
  )
}

const MemorizedModalSelectToken = memo(ModalSelectToken)
export default MemorizedModalSelectToken
