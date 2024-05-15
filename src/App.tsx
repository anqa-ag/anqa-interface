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
              <Button isIconOnly variant="light" className="size-[44px]">
                <Image width={44} src="/favicon.svg" />
              </Button>
            </div>
            <div className="flex gap-[16px]">
              <Button variant="light" className="px-[16px] text-base font-medium text-primaryHover">
                Trade
              </Button>
              <Button variant="light" className="px-[16px] text-base font-medium text-disable">
                Bridge
              </Button>
            </div>
            <Button color="primary" className="rounded-[4px]">
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
          <div>ok</div>

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
