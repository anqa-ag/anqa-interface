import React from "react";
import Updaters from "./redux/updaters/Updaters.tsx";
import AppHeader from "./AppHeader.tsx";
import AppFooter from "./AppFooter.tsx";
import Tooltips from "./components/Tooltips.tsx";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <Updaters>
            <div className="h-full bg-background text-foreground dark">
                <div className="h-full w-screen">
                    <div className="fixed top-0 h-full w-screen bg-[url('/images/background.svg')] bg-cover bg-bottom bg-no-repeat opacity-40" />
                    <Tooltips />
                    <div className="isolate flex min-h-screen flex-col">
                        <AppHeader />
                        {children}
                        <AppFooter />
                    </div>
                </div>
            </div>
        </Updaters>
    );
}
