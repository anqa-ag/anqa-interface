import { Button, Image } from "@nextui-org/react"

export default function App() {
  return (
    <main className="bg-background text-foreground dark">
      <div className="h-lvh">
        <div className="absolute h-lvh w-lvw bg-[url('/images/background.svg')] bg-cover bg-bottom bg-no-repeat opacity-40" />
        <div className="isolate">
          {/*
###############################################################################
#
#                                                                        HEADER
#
###############################################################################
*/}
          <header className="flex h-[84px] content-center items-center justify-between px-[60px]">
            <div>
              <Button isIconOnly variant="light" className="h-[44px] w-[44px]">
                <Image width={44} src="/favicon.svg" />
              </Button>
            </div>
            <div className="flex gap-[16px]">
              <Button variant="light" className="text-primaryHover px-[16px] text-base font-medium">
                Trade
              </Button>
              <Button variant="light" className="text-disable px-[16px] text-base font-medium">
                Bridge (coming soon)
              </Button>
            </div>
            <Button color="primary" className="rounded-[4px] text-base font-medium">
              Connect Wallet
            </Button>
          </header>
          {/*
###############################################################################
#
#                                                                          MAIN
#
###############################################################################
*/}
          <div className="mt-[60px] w-full">
            <div className="mx-auto flex max-w-[420px] flex-col">
              <div className="flex justify-between">
                <div className="flex gap-[12px]">
                  <Button
                    color="primary"
                    className="bg-primaryHover h-[32px] min-w-min rounded-[4px] p-[8px] font-normal text-black"
                  >
                    Swap
                  </Button>
                  <Button
                    color="primary"
                    className="bg-primaryHover h-[32px] min-w-min rounded-[4px] p-[8px] font-normal text-black"
                  >
                    Limit Order
                  </Button>
                </div>
                <Button isIconOnly variant="light" className="h-[32px] w-[32px] min-w-min">
                  <Image src="/icons/setting.svg" />
                </Button>
              </div>
            </div>
          </div>

          {/*
###############################################################################
#
#                                                                        FOOTER
#
###############################################################################
*/}
        </div>
      </div>
    </main>
  )
}
