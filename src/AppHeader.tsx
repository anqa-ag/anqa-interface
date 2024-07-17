import { Button, Image, Spacer } from "@nextui-org/react"
import { AnqaWithTextIcon } from "./components/Icons.tsx"
import useModal, { MODAL_LIST } from "./hooks/useModal.ts"
import Menu from "./components/Menu.tsx"
import { TitleT2 } from "./components/Texts.tsx"
import useAnqaWallet from "./hooks/useAnqaWallet.ts"
import { Network } from "@aptos-labs/ts-sdk"
import { getWalletImagePath } from "./utils/resources.ts"
import { useIsSm } from "./hooks/useMedia.ts"
import ModalConnectWallet from "./components/modals/ModalConnectWallet.tsx"
import AssetsAndActivities from "./components/modals/AssetsAndActivities.tsx"

export default function AppHeader() {
  const isSm = useIsSm()
  const { globalModal, isModalOpen, onOpenModal, onCloseModal, onOpenChangeModal } = useModal()

  return (
    <header className="flex h-[84px] items-center justify-between px-[60px] lg:px-[30px] md:justify-center md:px-[16px]">
      <div className="flex basis-2/12">
        <Button isIconOnly variant="light" className="h-fit w-fit px-3 py-1 data-[hover]:bg-transparent" disableRipple>
          <AnqaWithTextIcon size={40} />
        </Button>
      </div>
      {isSm ? (
        <div className="flex flex-row">
          <ButtonExploreNow />
          <Spacer x={6} />
          <ButtonConnectWallet
            onOpenModalConnectWallet={() => onOpenModal(MODAL_LIST.CONNECT_WALLET)}
            isOpenModalConnectWallet={globalModal === MODAL_LIST.CONNECT_WALLET && isModalOpen}
            onOpenModalHistories={() => onOpenModal(MODAL_LIST.ACTIVITIES)}
          />
        </div>
      ) : (
        <>
          <Menu />
          <div className="flex basis-2/12 flex-row text-end">
            <ButtonExploreNow />
            <Spacer x={6} />
            <ButtonConnectWallet
              onOpenModalConnectWallet={() => onOpenModal(MODAL_LIST.CONNECT_WALLET)}
              isOpenModalConnectWallet={globalModal === MODAL_LIST.CONNECT_WALLET && isModalOpen}
              onOpenModalHistories={() => onOpenModal(MODAL_LIST.ACTIVITIES)}
            />
          </div>
        </>
      )}
      <ModalConnectWallet
        isOpen={globalModal === MODAL_LIST.CONNECT_WALLET && isModalOpen}
        onOpenChange={onOpenChangeModal}
        onClose={onCloseModal}
      />
      <AssetsAndActivities
        isOpen={globalModal === MODAL_LIST.ACTIVITIES && isModalOpen}
        onOpenChange={onOpenChangeModal}
      />
    </header>
  )
}

function ButtonExploreNow() {
  const onPress = () => {}

  return (
    <Button
      color="primary"
      radius="md"
      className={"w-fit border-primary bg-primary px-4 text-white "}
      onPress={onPress}
      variant="solid"
    >
      <TitleT2>Explore now</TitleT2>
    </Button>
  )
}

function ButtonConnectWallet({
  onOpenModalConnectWallet,
  isOpenModalConnectWallet,
  onOpenModalHistories,
}: {
  onOpenModalConnectWallet: () => void
  isOpenModalConnectWallet: boolean
  onOpenModalHistories: () => void
}) {
  const { account, network, wallet, connected, isLoading: isLoadingWallet } = useAnqaWallet()
  const isMainnet = network ? network.name === Network.MAINNET : undefined

  const onPress = () => {
    connected ? onOpenModalHistories() : onOpenModalConnectWallet()
  }

  return (
    <div className="flex-1 text-end">
      <Button
        color="primary"
        className={
          "w-fit rounded px-4" +
          " " +
          (connected
            ? "border-buttonSecondary bg-background text-buttonSecondary"
            : "border-primary bg-primary text-white")
        }
        onPress={onPress}
        isLoading={isOpenModalConnectWallet || isLoadingWallet}
        variant={connected ? "bordered" : "solid"}
      >
        {wallet && connected && <Image width={20} className="min-w-[20px]" src={getWalletImagePath(wallet.name)} />}
        {connected && account?.address ? (
          isMainnet ? (
            <TitleT2>{account.address.slice(0, 4) + "..." + account.address.slice(-4)}</TitleT2>
          ) : (
            <TitleT2>Wrong Network ({network?.name || "N/A"})</TitleT2>
          )
        ) : isLoadingWallet ? (
          <TitleT2>Loading Wallet</TitleT2>
        ) : (
          <TitleT2>Connect Wallet</TitleT2>
        )}
      </Button>
    </div>
  )
}
