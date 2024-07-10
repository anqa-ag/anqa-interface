import React from "react"
import Updaters from "./redux/updaters/Updaters.tsx"
import AppHeader from "./AppHeader.tsx"
import AppFooter from "./AppFooter.tsx"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full bg-background text-foreground dark">
      <div className="h-full w-screen">
        <div className="isolate flex min-h-screen flex-col">
          <div className="fixed top-0 h-full w-screen bg-[url('/images/background.svg')] bg-cover bg-bottom bg-no-repeat opacity-40" />
          <Updaters />
          <AppHeader />
          {children}
          <AppFooter />
        </div>
      </div>
    </div>
  )
}
