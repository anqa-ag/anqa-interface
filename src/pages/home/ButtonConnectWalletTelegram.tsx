import { Button } from "@nextui-org/react"
import { useWalletTelegram } from "../../hooks/useWalletTelegram"
import { TitleT2 } from "../../components/Texts"

export default function ButtonConnectWalletTelegram() {
    const { address, connect, disconnect } = useWalletTelegram()

    return (
      <div className="flex-1 text-end">
        <Button
          color="primary"
          className={
            "w-fit rounded px-4" +
            " " +
            (address
              ? "border-buttonSecondary bg-background text-buttonSecondary"
              : "border-primary bg-primary text-white")
          }
          onPress={address ? disconnect : connect}
          variant={address ? "bordered" : "solid"}
        >
          {address ? (
            <TitleT2>{address.slice(0, 4) + "..." + address.slice(-4)}</TitleT2>
          ) : (
            <TitleT2>Connect Wallet (Petra)</TitleT2>
          )}
        </Button>
      </div>
    )
  }
