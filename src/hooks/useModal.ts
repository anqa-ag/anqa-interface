import { useDisclosure } from "@nextui-org/react"
import { useCallback, useState } from "react"

export enum MODAL_LIST {
  CONNECT_WALLET,
  SELECT_TOKEN_IN,
  SELECT_TOKEN_OUT,
  USER_SETTING,
}

export default function useModal() {
  const [globalModal, setGlobalModal] = useState(MODAL_LIST.CONNECT_WALLET)
  const { isOpen, onOpen: _onOpen, onClose, onOpenChange } = useDisclosure()
  const onOpen = useCallback(
    (modal: MODAL_LIST) => {
      onClose()
      setGlobalModal(modal)
      _onOpen()
    },
    [_onOpen, onClose],
  )
  return {
    globalModal,
    isModalOpen: isOpen,
    onOpenModal: onOpen,
    onCloseModal: onClose,
    onOpenChangeModal: onOpenChange,
  }
}
