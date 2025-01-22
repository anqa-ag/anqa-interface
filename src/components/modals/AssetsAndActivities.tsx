import { Button, Image, Link, Modal, ModalContent, Tab, Tabs } from '@nextui-org/react'
import React, { useMemo, useState } from 'react'

import { Icon } from '@iconify/react'
import useAnqaWallet from '../../hooks/useAnqaWallet'
import { useAppSelector } from '../../redux/hooks'
import { Asset } from '../../redux/slices/asset.ts'
import { ITransactionHistory } from '../../redux/slices/user.ts'
import { Fraction } from '../../utils/fraction.ts'
import { numberWithCommas } from '../../utils/number.ts'
import { getWalletImagePath } from '../../utils/resources.ts'
import { getDisplayPeriod } from '../../utils/time.ts'
import BasicTokenInfo from '../BasicTokenInfo.tsx'
import { sortBalanceFn, useTokensHasBalance } from '../../hooks/useTokenBalance.ts'
import { router } from '../../main.tsx'
import { isDesktop, isTablet } from 'react-device-detect'
import { TokenWithBalance } from './ModalSelectToken.tsx'
import { BodyB2, BodyB3, BodyB4, Headline2, Subtitle3 } from '../Texts.tsx'
import Copy from '../Copy.tsx'
import { getShortAddress } from '../../utils/token.ts'

interface Props extends React.HTMLProps<HTMLDivElement> {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export interface TransactionHistoryWithLogoUrl extends ITransactionHistory {
  tokenLogoIn: string
  tokenLogoOut: string
}

const ModalAssetsAndActivities: React.FC<Props> = ({ ...props }) => {
  const [isShowBalance, setShowBalance] = useState(false)
  const { account, wallet, disconnect } = useAnqaWallet()
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)

  const assets = useTokensHasBalance()

  const assetTokenList = useMemo(() => {
    const list = Object.values(assets) as TokenWithBalance[]
    return list.sort(sortBalanceFn)
  }, [assets])

  const txHistoryMap = useAppSelector((state) => state.user.txHistoryMap)
  const renderTransactionHistories = useMemo(() => {
    const transactionHistories = Object.values(txHistoryMap) as ITransactionHistory[]
    const followingTokenDataList = Object.values(followingTokenData) as Asset[]
    return transactionHistories.map((transactionHistory) => {
      const tokenLogoIn =
        followingTokenDataList.find((token) => token.id === transactionHistory.tokenInAddress)?.logoUrl ?? ''
      const tokenLogoOut =
        followingTokenDataList.find((token) => token.id === transactionHistory.tokenOutAddress)?.logoUrl ?? ''
      const res: TransactionHistoryWithLogoUrl = {
        version: transactionHistory.version,
        isSuccess: transactionHistory.isSuccess,
        details: transactionHistory.details,
        tokenInSymbol: transactionHistory.tokenInSymbol,
        tokenOutSymbol: transactionHistory.tokenOutSymbol,
        readableAmountIn: transactionHistory.readableAmountIn,
        readableAmountOut: transactionHistory.readableAmountOut,
        tokenLogoIn: tokenLogoIn,
        tokenLogoOut: tokenLogoOut,
        timestamp: transactionHistory.timestamp,
        tokenInAddress: transactionHistory.tokenInAddress,
        tokenOutAddress: transactionHistory.tokenOutAddress,
      }
      return res
    })
  }, [txHistoryMap, followingTokenData])

  const totalBalanceInUSD = useMemo(() => {
    if (!assets) return 0
    return (Object.values(assets) as TokenWithBalance[]).reduce((prev, curr) => {
      let rs = prev
      if (curr?.faBalanceUsd) rs = rs.add(curr.faBalanceUsd)
      if (curr?.coinBalanceUsd) rs = rs.add(curr.coinBalanceUsd)
      return rs
    }, new Fraction(0))
  }, [assets])

  if (!account) return null

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      placement="center"
      backdrop="transparent"
      size="full"
      classNames={{
        wrapper: 'flex justify-end',
      }}
      motionProps={{
        variants: {
          enter: {
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            x: 50,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
      className={`h-screen max-h-screen w-full ${isTablet || isDesktop ? 'max-w-[400px]' : 'max-w-full'}`}
      hideCloseButton
    >
      <ModalContent className="flex min-h-fit flex-col !rounded-xl bg-baseGrey1 pt-6 dark">
        <div className="mb-6 flex flex-row justify-between px-6">
          <div className="flex flex-row items-center gap-2">
            {wallet?.name && <Image src={getWalletImagePath(wallet.name)} width={18} />}
            <Subtitle3 className="leading-5 text-white">{getShortAddress(account.address)}</Subtitle3>
            <div className="flex gap-2">
              <Copy size={20} value={account.address} />
              <Link href={`https://aptoscan.com/account/${account?.address}`} isExternal className="text-baseGrey">
                <Icon icon="iconamoon:link-external" fontSize={20} color="text-baseGrey" />
              </Link>
              <Button
                className="h-[20px] w-[20px] min-w-0 flex-none justify-end bg-transparent p-0"
                isIconOnly
                onPress={() => {
                  props.onOpenChange(false)
                  void disconnect()
                }}
              >
                <Icon icon="ph:power-bold" fontSize={20} className="text-baseGrey" />
              </Button>
            </div>
          </div>
          <Button
            className="h-[20px] w-[20px] min-w-0 flex-none justify-end bg-transparent p-0"
            isIconOnly
            onClick={() => {
              props.onOpenChange(false)
              disconnect()
            }}
          >
            <Icon icon="mdi:close" fontSize={20} className="text-baseGrey" />
          </Button>
        </div>
        <div className="mx-6 mb-[24px] flex flex-col gap-1 rounded-[10px] p-3">
          <div className="flex items-center gap-2">
            <BodyB4 className="text-baseGrey">Total Balance</BodyB4>
            {isShowBalance ? (
              <Icon
                icon="mdi:eye-off-outline"
                fontSize={20}
                className="text-baseGrey"
                onClick={() => setShowBalance(!isShowBalance)}
              />
            ) : (
              <Icon
                icon="lucide:eye"
                fontSize={20}
                className="text-baseGrey"
                onClick={() => setShowBalance(!isShowBalance)}
              />
            )}
          </div>
          <Headline2 className="text-white">
            {isShowBalance
              ? totalBalanceInUSD
                ? `$${numberWithCommas(totalBalanceInUSD?.toSignificant(6), false)}`
                : undefined
              : '*** ***'}
          </Headline2>
        </div>
        <div className="flex w-full flex-1 flex-col overflow-auto dark">
          <Tabs
            radius="lg"
            variant="light"
            size="md"
            color="primary"
            className="tab-container pl-6"
            classNames={{
              tabList: 'rounded-lg p-0',
              cursor: 'rounded-lg px-0',
            }}
          >
            <Tab key="assets" title="Assets" className="h-[32px]">
              <div className="h-fit bg-baseGrey1">
                {assetTokenList.length === 0 ? (
                  <BodyB2 className="pt-4 text-center">No asset found</BodyB2>
                ) : (
                  assetTokenList.map((assetToken) => (
                    <AssetRow key={assetToken.id + assetToken.type} token={assetToken} />
                  ))
                )}
              </div>
            </Tab>
            <Tab key="activity" title="Activity" className="h-[32px]">
              <div>
                {renderTransactionHistories.length === 0 ? (
                  <BodyB2 className="mt-16 h-full text-center text-white">No activity found</BodyB2>
                ) : (
                  renderTransactionHistories
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((transactionHistory) => {
                      return <ActivityRow key={transactionHistory.timestamp} transactionHistory={transactionHistory} />
                    })
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      </ModalContent>
    </Modal>
  )
}

function AssetRow({ token }: { token: TokenWithBalance }) {
  const pathname = window.location.pathname
  return (
    <div className="w-full px-6 py-3 hover:bg-baseBlack">
      <BasicTokenInfo
        token={token}
        onClick={() => {
          if (pathname.startsWith('/swap'))
            router.navigate(`/swap/${token.id + '-' + pathname.split('-')[1]}`).catch(() => {})
        }}
      />
    </div>
  )
}

function ActivityRow({ transactionHistory }: { transactionHistory: TransactionHistoryWithLogoUrl }) {
  const [tokenInLogoSrc, setTokenInLogoSrc] = useState(transactionHistory.tokenLogoIn || '/images/404.svg')
  const [tokenOutLogoSrc, setTokenOutLogoSrc] = useState(transactionHistory.tokenLogoOut || '/images/404.svg')
  return (
    <div className="flex flex-row items-center justify-between px-6 py-2 hover:bg-baseBlack">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-1">
          <BodyB3 className="text-white">Swapped</BodyB3>
          <Link
            href={`https://aptoscan.com/transaction/${transactionHistory.version}`}
            isExternal
            className="text-baseGrey"
            showAnchorIcon
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Image width={16} height={16} src={tokenInLogoSrc} onError={() => setTokenInLogoSrc('/images/404.svg')} />
          <BodyB4 className="text-baseGrey">
            {transactionHistory.readableAmountIn} {transactionHistory.tokenInSymbol} to{' '}
          </BodyB4>
          <Image width={16} height={16} src={tokenOutLogoSrc} onError={() => setTokenOutLogoSrc('/images/404.svg')} />
          <BodyB4 className="text-baseGrey">
            {transactionHistory.readableAmountOut} {transactionHistory.tokenOutSymbol}
          </BodyB4>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col items-end gap-1">
          <BodyB3 className="leading-5 text-white">{transactionHistory.isSuccess ? 'Success' : 'Failed'}</BodyB3>
          <BodyB4 className="text-baseGrey">{getDisplayPeriod(Date.now() - transactionHistory.timestamp)}</BodyB4>
        </div>
      </div>
    </div>
  )
}

export default ModalAssetsAndActivities
