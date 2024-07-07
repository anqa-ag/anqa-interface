import { aptosConnectWallet, martianWallet, okxWallet, petraWallet, pontemWallet } from "../constants"

export function getWalletImagePath(walletName: string): string | undefined {
  return walletName === aptosConnectWallet.name
    ? "/images/google.png"
    : walletName === petraWallet.name
      ? "/images/petra.svg"
      : walletName === martianWallet.name
        ? "/images/martian.jpeg"
        : walletName === pontemWallet.name
          ? "/images/pontem.svg"
          : walletName === okxWallet.name
            ? "/images/okx.png"
            : undefined
}
