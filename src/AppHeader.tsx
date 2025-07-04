import { Button, Image } from '@nextui-org/react'
import { AnqaWithTextIcon } from './components/Icons.tsx'
import useModal, { MODAL_LIST } from './hooks/useModal.ts'
import { TitleT2 } from './components/Texts.tsx'
import useAnqaWallet from './hooks/useAnqaWallet.ts'
import { Network } from '@aptos-labs/ts-sdk'
import { getWalletImagePath } from './utils/resources.ts'
import { useIsSm } from './hooks/useMedia.ts'
import ModalConnectWallet from './components/modals/ModalConnectWallet.tsx'
import AssetsAndActivities from './components/modals/AssetsAndActivities.tsx'

export default function AppHeader() {
  const isSm = useIsSm()
  const { globalModal, isModalOpen, onOpenModal, onCloseModal, onOpenChangeModal } = useModal()

  return (
    <header className="flex h-[84px] items-center justify-between px-[60px] lg:px-[30px] md:justify-center md:px-[16px] sm:h-[46px] sm:justify-between sm:px-2">
      <div className="flex basis-2/12 justify-start">
        <Button isIconOnly variant="light" className="h-fit w-fit px-3 py-1 data-[hover]:bg-transparent" disableRipple>
          <AnqaWithTextIcon size={isSm ? 18 : 40} />
        </Button>
      </div>
      {isSm ? (
        <>
          <div className="flex basis-2/12 justify-end">
            <ButtonConnectWallet
              onOpenModalConnectWallet={() => onOpenModal(MODAL_LIST.CONNECT_WALLET)}
              isOpenModalConnectWallet={globalModal === MODAL_LIST.CONNECT_WALLET && isModalOpen}
              onOpenModalHistories={() => onOpenModal(MODAL_LIST.ACTIVITIES)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex basis-2/12 flex-row justify-end">
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

function ButtonConnectWallet({
  onOpenModalConnectWallet,
  isOpenModalConnectWallet,
  onOpenModalHistories,
}: {
  onOpenModalConnectWallet: () => void
  isOpenModalConnectWallet: boolean
  onOpenModalHistories: () => void
}) {
  const isSm = useIsSm()
  const { account, network, wallet, connected, isLoading: isLoadingWallet } = useAnqaWallet()
  const isMainnet = network ? network.name === Network.MAINNET : undefined

  const onPress = () => {
    connected ? onOpenModalHistories() : onOpenModalConnectWallet()
  }

  return (
    <div className="text-end">
      <Button
        color="primary"
        className={
          'w-fit rounded px-4 sm:h-fit sm:px-2 sm:py-2' +
          ' ' +
          (connected
            ? 'border-buttonSecondary bg-background text-buttonSecondary'
            : 'border-primary bg-primary text-white')
        }
        onPress={onPress}
        isLoading={isOpenModalConnectWallet || isLoadingWallet}
        spinner={
          <svg
            className={'h-5 w-5 animate-spin text-current' + isSm ? ' hidden' : ''}
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
        }
        variant={connected ? 'bordered' : 'solid'}
      >
        {wallet && connected && <Image width={20} src={getWalletImagePath(wallet.name)} />}
        {connected && account?.address ? (
          isMainnet ? (
            <TitleT2 className="sm:text-[10px] sm:leading-3">
              {account.address.slice(0, 4) + '...' + account.address.slice(-4)}
            </TitleT2>
          ) : (
            <TitleT2 className="sm:text-[10px] sm:leading-3">Wrong Network ({network?.name || 'N/A'})</TitleT2>
          )
        ) : isLoadingWallet ? (
          <TitleT2 className="sm:text-[10px] sm:leading-3">Loading Wallet</TitleT2>
        ) : (
          <TitleT2 className="sm:text-[10px] sm:leading-3">Connect Wallet</TitleT2>
        )}
      </Button>
    </div>
  )
}
