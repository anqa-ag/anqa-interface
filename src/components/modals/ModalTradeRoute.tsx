import { Button, Image, Modal, ModalContent, Spacer } from '@nextui-org/react'
import { useAppSelector } from '../../redux/hooks'
import { Fraction } from '../../utils/fraction.ts'
import { ChevronRight, CloseIcon } from '../Icons.tsx'
import { BodyB2, BodyB3, TitleT1, TitleT5 } from '../Texts.tsx'
import { Hop } from '../../hooks/useQuote.ts'

export default function ModalTradeRoute({
  isOpen,
  onClose,
  onOpenChange,
  srcCoinType,
  dstCoinType,
  readableAmountIn,
  readableAmountOut,
  rawAmountIn,
  paths,
}: {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
  srcCoinType: string
  dstCoinType: string
  readableAmountIn: string
  readableAmountOut: string
  rawAmountIn: string | undefined
  paths: Hop[][] | undefined
}) {
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
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
        <ModalContent className="max-w-[800px] bg-black900 p-4 text-foreground dark">
          <>
            <div className="flex items-center justify-between">
              <TitleT1>Your Trade Route</TitleT1>
              <Button isIconOnly variant="light" className="h-[20px] w-[20px] min-w-fit p-0" onPress={onClose}>
                <CloseIcon size={20} />
              </Button>
            </div>

            <Spacer y={4} />

            <div className="h-full w-full rounded bg-background p-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1">
                  <Image
                    width={20}
                    height={20}
                    className="min-h-[20px] min-w-[20px]"
                    src={followingTokenData?.[srcCoinType]?.logoUrl}
                  />
                  <TitleT5>
                    {readableAmountIn} {followingTokenData?.[srcCoinType]?.symbol || '--'}
                  </TitleT5>
                </div>
                <div className="flex items-center gap-1">
                  <TitleT5>
                    {readableAmountOut} {followingTokenData?.[dstCoinType]?.symbol || '--'}
                  </TitleT5>
                  <Image
                    width={20}
                    height={20}
                    className="min-h-[20px] min-w-[20px]"
                    src={followingTokenData?.[dstCoinType]?.logoUrl}
                  />
                </div>
              </div>
              <div className="relative flex max-h-[50vh] w-full px-[10px] py-1">
                <div className="absolute left-[10px] z-20 h-full w-px bg-buttonSecondary before:absolute before:left-0 before:top-1 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary"></div>
                <div className="absolute right-[10px] z-20 h-full w-px bg-buttonSecondary before:absolute before:left-0 before:top-1 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary"></div>
                <div className="flex w-full flex-col gap-3 overflow-auto">
                  {/* ROW */}
                  {(paths || []).map((path, index) => (
                    <div className="relative flex items-center py-4" key={index}>
                      <div className="absolute left-[24px] top-1/2 h-px w-[calc(100%-48px)] bg-buttonSecondary"></div>
                      <ChevronRight size={24} className="min-h-[24px] min-w-[24px]" />
                      <BodyB2 className="z-10 w-[52px] min-w-[52px] rounded border-1 border-buttonSecondary bg-background px-2 py-1 text-center text-buttonSecondary">
                        {rawAmountIn
                          ? new Fraction(path[0].srcAmount, rawAmountIn).multiply(100).toSignificant(4) + '%'
                          : '--'}
                      </BodyB2>
                      <div className="z-10 mx-4 flex flex-1 justify-center">
                        <div className="flex gap-[36px]">
                          {path.map((hop, index) => (
                            <div className="rounded border-1 border-buttonSecondary" key={index}>
                              <div className="flex w-[160px] items-center gap-1 bg-black900 p-2">
                                <Image
                                  width={20}
                                  height={20}
                                  className="min-h-[20px] min-w-[20px]"
                                  src={hop.dstAsset?.logoUrl}
                                />
                                <TitleT5>{hop.dstAsset?.symbol || '--'}</TitleT5>
                              </div>
                              <div className="flex w-[160px] items-center gap-1 bg-background p-2">
                                <Image
                                  width={20}
                                  height={20}
                                  className="min-h-[20px] min-w-[20px]"
                                  src={hop.pool?.logoUrl}
                                />
                                <BodyB3 className="text-buttonSecondary">{hop.pool?.name || '--'}: 100%</BodyB3>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ChevronRight size={24} className="min-h-[24px] min-w-[24px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        </ModalContent>
      </Modal>
    </>
  )
}
