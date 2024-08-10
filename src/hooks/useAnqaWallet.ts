import { WalletContextState, useWallet } from '@aptos-labs/wallet-adapter-react'
import useTelegramWallet from './useTelegramWallet'
import TelegramWebApp from '@twa-dev/sdk'
import { useMemo } from 'react'

export type AnqaWalletState = Pick<
  WalletContextState,
  'account' | 'connect' | 'connected' | 'disconnect' | 'isLoading' | 'signAndSubmitTransaction' | 'wallet' | 'network'
> & { isTelegram: boolean }

export default function useAnqaWallet(): AnqaWalletState {
  const wallet = useWallet()
  const telegramWallet = useTelegramWallet()

  return useMemo<AnqaWalletState>(
    () =>
      TelegramWebApp.initDataUnsafe.user ? { ...telegramWallet, isTelegram: true } : { ...wallet, isTelegram: false },
    [telegramWallet, wallet],
  )
}
