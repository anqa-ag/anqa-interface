import { Image, Button, Modal, ModalContent, Spacer } from "@nextui-org/react"
import useMartian from "../../redux/hooks/useMartian"
import { CloseIcon } from "../Icons"
import { BodyB2, TitleT1, TitleT2, TitleT5 } from "../Texts"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setProvider } from "../../redux/slices/wallet"
import usePetra from "../../redux/hooks/usePetra"
import { martian, petra } from "../../../types.ts"
import { isDesktop } from "react-device-detect"

export default function ModalConnectWallet({
  isOpen,
  onClose,
  onOpenChange,
}: {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
}) {
  const dispatch = useAppDispatch()

  const provider = useAppSelector((state) => state.wallet.provider)
  const isMartian = provider === "Martian"
  const isPetra = provider === "Petra"

  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string>()

  const { onConnect: onConnectMartian } = useMartian()
  const { onConnect: onConnectPetra } = usePetra()

  const onConnect = (wantedProvider: "Martian" | "Petra") => async () => {
    dispatch(setProvider(wantedProvider))

    setIsConnecting(true)
    try {
      let ok: boolean | undefined
      switch (wantedProvider) {
        case "Martian":
          ok = await onConnectMartian()
          break
        case "Petra":
          ok = await onConnectPetra()
      }
      if (ok) onClose()
    } catch (err) {
      console.error(err)
      setError((err as Error).toString())
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur" hideCloseButton>
        <ModalContent className="max-w-[420px] bg-buttonDisabled p-4 text-foreground dark">
          {(onClose) => (
            <>
              <div className="flex items-center justify-between">
                <TitleT1>Welcome to Anqa</TitleT1>
                <Button isIconOnly variant="light" className="h-[20px] w-[20px] min-w-fit p-0" onPress={onClose}>
                  <CloseIcon size={20} />
                </Button>
              </div>

              <Spacer y={4} />

              <BodyB2 className="text-buttonSecondary">To get started, please connect your wallet</BodyB2>

              <Spacer y={4} />

              <div className="flex flex-col gap-3">
                {/* PETRA */}
                <div className="flex w-full flex-col gap-1">
                  <Button
                    className="flex items-center justify-between rounded bg-background px-4 py-3"
                    onPress={onConnect("Petra")}
                    isLoading={isPetra && isConnecting}
                  >
                    <div className="flex items-center gap-2">
                      <Image width={20} src="/images/petra.svg" />
                      <TitleT2>Petra</TitleT2>
                    </div>
                    {petra && (
                      <div className="flex items-center gap-2">
                        <div className="h-[6.67px] w-[6.67px] rounded-full bg-buttonGreen"></div>
                        <TitleT5>Detected</TitleT5>
                      </div>
                    )}
                  </Button>
                  {isPetra && error && <BodyB2 className="text-buttonRed">{error}</BodyB2>}
                </div>

                {/* MARTIAN */}
                {isDesktop && (
                  <>
                    <div className="flex w-full flex-col gap-1">
                      <Button
                        className="flex w-full items-center justify-between rounded bg-background px-4 py-3"
                        onPress={onConnect("Martian")}
                        isLoading={isMartian && isConnecting}
                      >
                        <div className="flex items-center gap-2">
                          <Image width={20} src="/images/martian.jpeg" />
                          <TitleT2>Martian</TitleT2>
                        </div>
                        {martian && (
                          <div className="flex items-center gap-2">
                            <div className="h-[6.67px] w-[6.67px] rounded-full bg-buttonGreen"></div>
                            <TitleT5>Detected</TitleT5>
                          </div>
                        )}
                      </Button>
                      {isMartian && error && <BodyB2 className="text-buttonRed">{error}</BodyB2>}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
