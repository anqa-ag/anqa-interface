import React, { useCallback, useMemo, useState } from "react"
import { Button, Image, Link, Modal, ModalContent, Tab, Tabs } from "@nextui-org/react"

import { ArrowRightIcon, PowerIcon } from "../Icons"
import useAnqaWallet from "../../hooks/useAnqaWallet"
import { TitleT1, TitleT2, TitleT4, TitleT5 } from "../Texts"
import { Network } from "@aptos-labs/ts-sdk"
import {
  NOT_FOUND_TOKEN_LOGO_URL
} from "../../constants"
import { Fraction } from "../../utils/fraction.ts"
import { divpowToFraction, mulpowToFraction } from "../../utils/number.ts"
import { TokenWithBalance } from "./ModalSelectToken.tsx"
import { useAppSelector } from "../../redux/hooks"
import BasicTokenInfo from "../BasicTokenInfo.tsx"
import { useCopyToClipboard } from "usehooks-ts"
import useTokenPrice from "../../hooks/useTokenPrice.ts"
import { ITransactionHistory } from "../../redux/slices/user.ts"
import { getDisplayPeriod } from "../../utils/time.ts"
import useFullTokens from "../../hooks/useFullTokens.ts"
import { Icon } from "@iconify/react"
import { getWalletImagePath } from "../../utils/resources.ts"


interface Props extends React.HTMLProps<HTMLDivElement> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface TransactionHistoryWithLogoUrl extends ITransactionHistory {
  tokenLogoIn: string;
  tokenLogoOut: string;
}

const AssetsAndActivities: React.FC<Props> = ({ ...props }) => {
  const {
    account,
    network,
    disconnect,
    wallet,
    connected,
    isLoading: isLoadingWallet
  } = useAnqaWallet()
  const isMainnet = network ? network.name === Network.MAINNET : undefined
  const { balance } = useAppSelector((state) => state.wallet)
  const assetSymbols = useMemo(() => Object.keys(balance), [balance])
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
  const { data: fullTokenData } = useFullTokens()
  const { tokenPriceMap } = useTokenPrice(assetSymbols)
  const assets = useMemo(() => {
    const res: Record<string, TokenWithBalance> = {}
    for (const key of Object.keys(balance)) {
      let fractionalBalance: Fraction | undefined
      const tokenBalance = balance[key]
      if (fullTokenData && tokenBalance) {
        const tokenInfo = fullTokenData[key]
        if (connected && tokenBalance && tokenBalance.amount) {
          fractionalBalance = divpowToFraction(tokenBalance.amount, tokenInfo.decimals)
        }
        let fractionalBalanceUsd: Fraction | undefined
        if (fractionalBalance && tokenPriceMap?.[key]) {
          const fractionalPrice = mulpowToFraction(tokenPriceMap?.[key].price)
          fractionalBalanceUsd = fractionalBalance.multiply(fractionalPrice)
        }
        res[key] = {
          id: key,
          name: tokenInfo.name,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals,
          whitelisted: (followingTokenData?.[key]) ? followingTokenData[key].whitelisted : false,
          logoUrl: (followingTokenData?.[key]) ? followingTokenData[key].logoUrl : undefined,
          fractionalBalance,
          fractionalBalanceUsd,
          isFollowing: true
        }
      }
    }
    return res
  }, [balance, fullTokenData, connected, tokenPriceMap, followingTokenData])

  const assetTokenList = useMemo(() => {
    const list = Object.values(assets)
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
  }, [assets])

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
    [copy]
  )
  const transactionHistories = useAppSelector((state) => state.user.txHistoryMap)
  const renderTransactionHistories = useMemo(() => {
    return Object.values(transactionHistories).map((transactionHistory) => {
      const tokenLogoIn = Object.values(followingTokenData).find((token) => token.id === transactionHistory.tokenInAddress)?.logoUrl ?? ""
      const tokenLogoOut = Object.values(followingTokenData).find((token) => token.id === transactionHistory.tokenOutAddress)?.logoUrl ?? ""
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
        tokenOutAddress: transactionHistory.tokenOutAddress
      }
      return res
    })
  }, [transactionHistories, followingTokenData])

  const totalBalanceInUSD = useMemo(() => {
    if (!assets) return 0
    else return Object.values(assets).reduce((prev, curr) => (curr.fractionalBalanceUsd?.add(prev)),
      new Fraction(0))
  }, [assets])
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      placement="center"
      backdrop="transparent"
      size="full"
      classNames={{
        wrapper: "flex justify-end"
      }}
      motionProps={{
        variants: {
          enter: {
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          },
          exit: {
            x: 50,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn"
            }
          }
        }
      }}
      className="max-w-sm w-full h-screen max-h-screen"
      hideCloseButton
    >
      <ModalContent className="flex flex-col px-6 pt-6 dark rounded-lg text-foreground">
        <div className="flex flex-row justify-between mb-6">
          <Button className="h-[20px] w-[20px] bg-transparent p-0 justify-start"
                  isIconOnly
                  onClick={() => props.onOpenChange(false)}>
            <ArrowRightIcon size={20} className="flex-none" />
          </Button>
          <div className="flex flex-row">
            {wallet && connected && (
              <Image
                width={20}
                className="min-w-[20px] mr-2"
                src={
                  getWalletImagePath(wallet.name)
                }
              />
            )}
            {connected && account?.address ? (
              isMainnet ? (
                <TitleT2
                  className="leading-5 mr-2">{account.address.slice(0, 4) + "..." + account.address.slice(-4)}</TitleT2>
              ) : (
                <TitleT2 className="text-buttonRed leading-5 mr-2">Wrong Network ({network})</TitleT2>
              )
            ) : isLoadingWallet ? (
              <TitleT2 className="text-buttonRed leading-5 mr-2">Loading Wallet</TitleT2>
            ) : (
              <TitleT2 className="text-buttonRed leading-5 mr-2">Connect Wallet</TitleT2>
            )}
            <Button className="h-[20px] w-[20px] bg-transparent p-0 min-w-0 mr-2"
                    isIconOnly
                    onClick={async () => {
                      if (account?.address) {
                        await onCopy(account.address)
                      }
                    }}
            >
              {(isCopying && copiedId === account?.address) ? (
                <Icon icon="material-symbols:check" fontSize={20} className="text-tooltipBg" />) : (
                <Icon icon="ph:copy" fontSize={20} className="text-tooltipBg" />)}
            </Button>
            <Link
              href={`https://aptoscan.com/account/${account?.address}`}
              isExternal
              showAnchorIcon
              className="text-buttonSecondary"
            />
          </div>
          <Button
            className="h-[20px] w-[20px] bg-transparent p-0 justify-end flex-none min-w-0"
            isIconOnly
            onClick={() => {
              props.onOpenChange(false)
              disconnect()
            }
            }
          >
            <PowerIcon size={20} />
          </Button>
        </div>
        <div>
          <TitleT1
            className="mb-6">${totalBalanceInUSD ? `${totalBalanceInUSD?.toSignificant(6)}` : undefined}</TitleT1>
        </div>
        <div className="flex w-full flex-col">
          <Tabs radius="sm" variant="light" size="md" color="primary">
            <Tab key="assets" title="Assets" className="pt-0">
              <div className="h-[calc(100vh-12rem)] overflow-auto">
                {assetTokenList.length === 0 ? (
                  <TitleT4 className="pt-4 text-center">No asset found</TitleT4>
                ) : (
                  assetTokenList.map((assetToken) => (
                    <AssetRow key={assetToken.id} token={assetToken} onCopy={onCopy} isCopying={isCopying}
                              copiedId={copiedId} />
                  ))
                )
                }
              </div>
            </Tab>
            <Tab key="activities" title="Activities" className="pt-0">
              <div className="h-[calc(100vh-12rem)] overflow-auto">
                {
                  renderTransactionHistories.length === 0 ? (
                    <TitleT4 className="pt-4 text-center">No activity found</TitleT4>
                  ) : (renderTransactionHistories.sort((a, b) => b.timestamp - a.timestamp).map((transactionHistory) => {
                    return <ActivityRow key={transactionHistory.timestamp} transactionHistory={transactionHistory} />
                  }))
                }
              </div>
            </Tab>
          </Tabs>
        </div>
      </ModalContent>
    </Modal>
  )
}

function AssetRow({ token, onCopy, copiedId, isCopying }: {
  token: TokenWithBalance,
  onCopy: (id: string) => void,
  copiedId: string,
  isCopying: boolean
}) {
  const isCopyingThisToken = useMemo(
    () => isCopying && copiedId === token.id,
    [copiedId, isCopying, token.id]
  )
  return <div className="py-2">
    <BasicTokenInfo token={token} onCopy={onCopy} isCopying={isCopyingThisToken} />
  </div>
}

function ActivityRow({
                       transactionHistory
                     }: {
  transactionHistory: TransactionHistoryWithLogoUrl,
}) {
  const [tokenInLogoSrc, setTokenInLogoSrc] = useState(transactionHistory.tokenLogoIn || NOT_FOUND_TOKEN_LOGO_URL)
  const [tokenOutLogoSrc, setTokenOutLogoSrc] = useState(transactionHistory.tokenLogoOut || NOT_FOUND_TOKEN_LOGO_URL)
  return <div className="flex flex-row py-2 items-center justify-between">
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-1 items-center">
        <TitleT2>Swapped</TitleT2>
        <Link
          href={`https://aptoscan.com/transaction/${transactionHistory.version}`}
          isExternal
          className="text-buttonSecondary"
          showAnchorIcon
        />
      </div>
      <div className="flex flex-row gap-1 items-center">
        <Image
          width={16}
          height={16}
          src={tokenInLogoSrc}
          onError={() => setTokenInLogoSrc(NOT_FOUND_TOKEN_LOGO_URL)}
        />
        <TitleT5
          className="text-buttonSecondary">{transactionHistory.readableAmountIn} {transactionHistory.tokenInSymbol} to </TitleT5>
        <Image
          width={16}
          height={16}
          src={tokenOutLogoSrc}
          onError={() => setTokenOutLogoSrc(NOT_FOUND_TOKEN_LOGO_URL)}
        />
        <TitleT5
          className="text-buttonSecondary">{transactionHistory.readableAmountOut} {transactionHistory.tokenOutSymbol}</TitleT5>
      </div>
    </div>
    <div className="flex flex-col">
      <div className="flex flex-col items-end gap-1">
        <TitleT2 className="leading-5 text-white">{transactionHistory.isSuccess ? "Success" : "Failed"}</TitleT2>
        <TitleT5
          className="text-buttonSecondary">{getDisplayPeriod(Date.now() - transactionHistory.timestamp)}</TitleT5>
      </div>
    </div>
  </div>
}


export default AssetsAndActivities
