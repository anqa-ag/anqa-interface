import { useState, ReactNode } from "react"
import { MenuContext } from "./MenuContext.ts"

export default function MenuContextProvider({ children }: { children: ReactNode }) {
  const [activeMenu, setActiveMenu] = useState("swap")

  return <MenuContext.Provider value={{ activeMenu, setActiveMenu }}>{children}</MenuContext.Provider>
}
