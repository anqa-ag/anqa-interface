import { Button, Modal, ModalContent, Spacer } from "@nextui-org/react"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks/index.ts"
import { setSlippage } from "../../redux/slices/user.ts"
import { mulpowToFraction } from "../../utils/number.ts"
import { CloseIcon } from "../Icons.tsx"
import { BodyB1, BodyB2, TitleT1 } from "../Texts.tsx"

function ButtonSlippage({ value, onClose }: { value: number; onClose: () => void }) {
  const dispatch = useAppDispatch()
  const slippageBps = useAppSelector((state) => state.user.slippageBps)
  const onPress = () => {
    dispatch(setSlippage(value))
    onClose()
  }

  return (
    <Button
      className={
        "h-[40px] min-w-fit rounded-none bg-background p-5 sm:p-[10px]" +
        " " +
        (value === slippageBps ? "!bg-primaryHover" : "")
      }
      disableAnimation
      onPress={onPress}
    >
      <BodyB1 className={"text-buttonSecondary" + " " + (value === slippageBps ? "!text-black" : "")}>
        {value / 100}%
      </BodyB1>
    </Button>
  )
}

export default function ModalUserSetting({
  isOpen,
  onClose: _onClose,
  onOpenChange,
}: {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
}) {
  const dispatch = useAppDispatch()
  const slippageBps = useAppSelector((state) => state.user.slippageBps)
  const [input, setInput] = useState("")

  const onInputBlur = () => {
    try {
      if (input === "") {
        setInput((slippageBps / 100).toString())
        return
      }
      const num = mulpowToFraction(input)
      if (num && num.greaterThan(0) && (num.lessThan(100) || num.equalTo(100))) {
        dispatch(setSlippage(parseInt(num.multiply(100).toSignificant(4))))
        setInput(num.toSignificant(4))
      } else {
        setInput((slippageBps / 100).toString())
      }
    } catch (err) {
      setInput((slippageBps / 100).toString())
    }
  }
  const onClose = () => {
    onInputBlur()
    setInput("")
    _onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        hideCloseButton
        onClose={onClose}
      >
        {/* <Modal isOpen={true} onOpenChange={onOpenChange} placement="center" backdrop="blur" hideCloseButton> */}
        <ModalContent className="max-w-[420px] bg-buttonDisabled p-4 text-foreground dark">
          <>
            <div className="flex items-center justify-between">
              <TitleT1>General Settings</TitleT1>
              <Button isIconOnly variant="light" className="h-[20px] w-[20px] min-w-fit p-0" onPress={onClose}>
                <CloseIcon size={20} />
              </Button>
            </div>

            <Spacer y={4} />

            <BodyB2
              className="w-fit border-b-1 border-dashed border-buttonSecondary text-buttonSecondary"
              tabIndex={0}
              data-tooltip-id="tooltip-max-slippage"
            >
              Max slippage
            </BodyB2>

            <Spacer y={3} />

            <div className="flex items-center overflow-hidden rounded">
              <ButtonSlippage value={5} onClose={_onClose} />
              <ButtonSlippage value={10} onClose={_onClose} />
              <ButtonSlippage value={50} onClose={_onClose} />
              <ButtonSlippage value={100} onClose={_onClose} />
              <div className="flex h-[40px] items-center gap-1 bg-background pr-3">
                <input
                  className="w-full bg-transparent text-end text-base font-normal text-disable outline-none placeholder:text-disable"
                  inputMode="decimal"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  minLength={1}
                  maxLength={30}
                  spellCheck="false"
                  pattern="^[0-9]{1,2}[.,]?[0-9]{0,2}$"
                  placeholder={(slippageBps / 100).toString()}
                  value={input}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  onBlur={onInputBlur}
                />
                <BodyB1 className="text-disable">%</BodyB1>
              </div>
            </div>
          </>
        </ModalContent>
      </Modal>
    </>
  )
}
