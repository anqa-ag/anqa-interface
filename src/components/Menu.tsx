import { Button } from "@nextui-org/react"
import { BodyB3, TitleT2 } from "./Texts"

export default function Menu() {
  return (
    <div className="flex items-center gap-4 md:justify-center md:gap-2">
      <Button variant="light" className="min-w-0 rounded border-1 border-primaryHover px-4">
        <TitleT2 className="text-primaryHover">Swap</TitleT2>
      </Button>
      <Button variant="light" className="gap-1 rounded px-4" isDisabled>
        <TitleT2 className="text-disable">Bridge</TitleT2>
        <BodyB3 className="rounded border-1 border-primary px-1 align-bottom text-primary">soon</BodyB3>
      </Button>
    </div>
  )
}
