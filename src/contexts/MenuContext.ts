import { createContext } from "react"

export const MenuContext = createContext({
  activeMenu: "swap",
  setActiveMenu: (_value:  string) => {}
})
