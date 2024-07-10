import { useState, ReactNode } from "react"
import { MenuContext } from "./MenuContext.ts"

export default function MenuContextProvider({ children }: { children: ReactNode }) {
  const [activeMenu, setActiveMenu] = useState("swap")
  console.log("12321")
  console.log(activeMenu)
  console.log(setActiveMenu)
  return <MenuContext.Provider value={{ activeMenu, setActiveMenu }}>{children}</MenuContext.Provider>
}
