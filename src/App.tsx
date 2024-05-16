import { Button, Image } from "@nextui-org/react"
import Setting from "./assets/icons/Setting"
import Swap from "./assets/icons/Swap"

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
              <Button isIconOnly variant="light" className="h-[48px] w-[48px]">
                <Image width={60} src="/favicon.png" />
              </Button>
            </div>
            <div className="flex gap-4">
              <Button variant="light" className="px-4 text-base font-medium text-primaryHover">
                Trade
              </Button>
              <Button variant="light" className="px-4 text-base font-medium text-disable">
                Bridge (soon)
              </Button>
            </div>
            <Button color="primary" className="rounded text-base font-medium">
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
                <div className="flex gap-3">
                  <Button
                    color="primary"
                    className="h-8 min-w-min gap-1 rounded bg-primaryHover p-2 font-normal text-black"
                    endContent={<Swap />}
                  >
                    Swap
                  </Button>
                </div>
                <Button isIconOnly variant="light" className="h-2 w-2 min-w-min">
                  <Setting />
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
