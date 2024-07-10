import { Button } from "@nextui-org/react"
import { BodyB3, TitleT2 } from "./Texts"
import { TheNestIcon } from "./Icons.tsx"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { MenuContext } from "../contexts/MenuContext.ts"
import { SwapContext } from "../contexts/SwapContext.ts"

export default function Menu() {
  const navigate = useNavigate()
  const { swapLocation } = useContext(SwapContext)
  const { activeMenu } = useContext(MenuContext)
  const isActiveSwap = activeMenu === "swap"
  const isActiveTheNest = activeMenu === "the-nest"
  return (
    <div className="flex items-center gap-4 md:justify-center md:gap-2">
      <Button
        variant="light"
        className={"min-w-0 rounded px-4" + (isActiveSwap ? " border-1 border-primaryHover" : "")}
        onPress={() => {
          navigate(swapLocation, { replace: true })
        }}
      >
        <TitleT2 className={!isActiveSwap ? " text-disable" : " text-primaryHover"}>Swap</TitleT2>
      </Button>
      <Button
        variant="light"
        className={"gap-1 rounded px-4" + (isActiveTheNest ? " border-1 border-primaryHover" : "")}
        onPress={() => navigate("/the-nest", { replace: true })}
      >
        <TitleT2 className={"mr-3" + (!isActiveTheNest ? " text-disable" : " text-primaryHover")}>The Nest</TitleT2>
        <TheNestIcon size={25} />
      </Button>
      <Button variant="light" className="gap-1 rounded px-4" isDisabled>
        <TitleT2 className="text-disable">Bridge</TitleT2>
        <BodyB3 className="rounded border-1 border-primary px-1 align-bottom text-primary">soon</BodyB3>
      </Button>
    </div>
  )
}
