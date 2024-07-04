import React from "react"
import { Modal, ModalContent, Image, Tabs, Tab, Button } from "@nextui-org/react"
import { useState } from "react"

import {
  ArrowRightIcon,
  PowerIcon,
  NavigateIcon,
  CopyIcon
} from "../Icons"
import useAnqaWallet from "../../hooks/useAnqaWallet"
import { BodyB3, TitleT1, TitleT2, TitleT5 } from "../Texts"
import { Network } from "@aptos-labs/ts-sdk"
import {
  aptosConnectWallet,
  martianWallet,
  okxWallet,
  petraWallet,
  pontemWallet,
  NOT_FOUND_TOKEN_LOGO_URL
} from "../../constants"


interface Props extends React.HTMLProps<HTMLDivElement> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}


const Histories: React.FC<Props> = ({ ...props }) => {
  const {
    account,
    network,
    connect,
    disconnect,
    wallet,
    connected,
    isLoading: isLoadingWallet,
    isTelegram
  } = useAnqaWallet()
  const isMainnet = network ? network.name === Network.MAINNET : undefined
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
          <Button className="h-[20px] w-[20px] bg-transparent p-0"
                  isIconOnly
                  onClick={() => props.onOpenChange(false)}>
            <ArrowRightIcon size={20} className="flex-none" />
          </Button>
          <div className="flex row">
            {wallet && connected && (
              <Image
                width={20}
                className="min-w-[20px] mr-2"
                src={
                  wallet.name === aptosConnectWallet.name
                    ? "/images/google.png"
                    : wallet.name === petraWallet.name
                      ? "/images/petra.svg"
                      : wallet.name === martianWallet.name
                        ? "/images/martian.jpeg"
                        : wallet.name === pontemWallet.name
                          ? "/images/pontem.svg"
                          : wallet.name === okxWallet.name
                            ? "/images/okx.png"
                            : undefined
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
            <Button className="h-[20px] w-[20px] bg-transparent p-0"
                    isIconOnly
                    onClick={() => props.onOpenChange(false)}>
              <CopyIcon size={20} className="mr-2" />
            </Button>
            <Button className="h-[20px] w-[20px] bg-transparent"
                    isIconOnly
                    onClick={() => props.onOpenChange(false)}>
              <NavigateIcon size={20} />
            </Button>
          </div>
          <Button className="h-[20px] w-[20px] bg-transparent p-0"
                  isIconOnly
                  onClick={() => {
                    props.onOpenChange(false)
                    disconnect()
                  }
                  }
          >
            <PowerIcon size={20} className="flex-none" />
          </Button>
        </div>
        <div>
          <TitleT1 className="mb-6">$1,232.32</TitleT1>
        </div>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" radius="sm" variant="light" size="md" color="primary">
            <Tab key="assets" title="Assets">
              <div className="h-[calc(100vh-12rem)] overflow-auto -p-2">
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
                <AssetRow logoUrl="" address="0x1::a...Coin" symbol="USDC" description="LayzerZero USD Coin"
                          amount="0.0366" amountInUSD="$6.62" />
              </div>
            </Tab>
            <Tab key="activities" title="Activities" >
              <div className="h-[calc(100vh-12rem)] overflow-auto -p-2">
                <ActivityRow type="Swapped" tokenInAmount="0.01" tokenInLogo="" tokenInSymbol="APTOS" tokenOutAmount="24.24" tokenOutLogo="" tokenOutSymbol="USDC" transactionStatus="Success" transactionTime="7d ago"/>
                <ActivityRow type="Swapped" tokenInAmount="0.01" tokenInLogo="" tokenInSymbol="APTOS" tokenOutAmount="24.24" tokenOutLogo="" tokenOutSymbol="USDC" transactionStatus="Success" transactionTime="7d ago"/>
                <ActivityRow type="Swapped" tokenInAmount="0.01" tokenInLogo="" tokenInSymbol="APTOS" tokenOutAmount="24.24" tokenOutLogo="" tokenOutSymbol="USDC" transactionStatus="Success" transactionTime="7d ago"/>
              </div>
            </Tab>
          </Tabs>
        </div>
      </ModalContent>
    </Modal>
  )
}

function AssetRow({ logoUrl, address, symbol, description, amount, amountInUSD }: {
  logoUrl: string,
  symbol: string,
  address: string,
  description: string,
  amount: string,
  amountInUSD: string
}) {
  const [tokenLogoSrc, setTokenLogoSrc] = useState(logoUrl || NOT_FOUND_TOKEN_LOGO_URL)
  return <div className="flex flex-row py-2 items-center">
    <div className="flex-none mr-1">
      <Image
        width={28}
        height={28}
        className="min-h-[20px] min-w-[20px]"
        src={tokenLogoSrc}
        onError={() => setTokenLogoSrc(NOT_FOUND_TOKEN_LOGO_URL)}
      />
    </div>
    <div className="flex flex-col grow gap-1">
      <div className="flex flex-row items-center gap-1.5">
        <TitleT2 className="leading-5">{symbol}</TitleT2>
        <TitleT5 className="leading-5 text-buttonSecondary">{address}</TitleT5>
        <CopyIcon size={16} />
      </div>
      <div>
        <TitleT5 className="mr-1.5 text-buttonSecondary">{description}</TitleT5>
      </div>
    </div>
    <div className="flex-none">
      <div className="flex flex-col items-end gap-1">
        <TitleT2 className="leading-5">{amount}</TitleT2>
        <BodyB3 className="text-buttonSecondary">{amountInUSD}</BodyB3>
      </div>
    </div>
  </div>
}

function ActivityRow({ type, tokenInLogo, tokenInAmount, tokenInSymbol, tokenOutLogo, tokenOutAmount, tokenOutSymbol, transactionStatus, transactionTime }: {
  type: string,
  tokenInLogo: string,
  tokenInAmount: string,
  tokenInSymbol: string,
  tokenOutLogo: string,
  tokenOutAmount: string,
  tokenOutSymbol: string,
  transactionStatus: string,
  transactionTime: string
}) {
  const [tokenInLogoSrc, setTokenInLogoSrc] = useState(tokenInLogo || NOT_FOUND_TOKEN_LOGO_URL)
  const [tokenOutLogoSrc, setTokenOutLogoSrc] = useState(tokenOutLogo || NOT_FOUND_TOKEN_LOGO_URL)
  return <div className="flex flex-row py-2 items-center justify-between">
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-1 items-center">
        <TitleT2 >{type}</TitleT2>
        <NavigateIcon size={16} />
      </div>
      <div className="flex flex-row gap-1">
        <Image
          width={16}
          height={16}
          src={tokenInLogoSrc}
          onError={() => setTokenInLogoSrc(NOT_FOUND_TOKEN_LOGO_URL)}
        />
        <TitleT5 className="text-buttonSecondary">{tokenInAmount} {tokenInSymbol} to </TitleT5>
        <Image
          width={16}
          height={16}
          src={tokenOutLogoSrc}
          onError={() => setTokenOutLogoSrc(NOT_FOUND_TOKEN_LOGO_URL)}
        />
        <TitleT5 className="text-buttonSecondary">{tokenOutAmount} {tokenOutSymbol}</TitleT5>
      </div>
    </div>
    <div className="flex flex-col">
      <div className="flex flex-col items-end gap-1">
        <TitleT2 className="leading-5 text-white">{transactionStatus}</TitleT2>
        <BodyB3 className="text-buttonSecondary">{transactionTime}</BodyB3>
      </div>
    </div>
  </div>
}


export default Histories
