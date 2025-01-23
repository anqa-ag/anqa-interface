import { AptosConnectWallet } from '@aptos-connect/wallet-adapter-plugin'
import { PetraWallet } from 'petra-plugin-wallet-adapter'
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter'
import { PontemWallet } from '@pontem/wallet-adapter-plugin'
import { OKXWallet } from '@okwallet/aptos-wallet-adapter'
import { Wallet } from '@aptos-labs/wallet-adapter-react'
import { NightlyWallet } from '@nightlylabs/aptos-wallet-adapter-plugin'

export const ZUSDC = '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC'

export const NOT_FOUND_TOKEN_LOGO_URL =
  'https://png.pngtree.com/png-clipart/20190516/original/pngtree-question-mark-vector-icon-png-image_4236972.jpg'

export const BIP_BASE = 10_000
export const BIP_BASE_BN = 10_000n

export const ENV = import.meta.env.VITE_ENV
export const AGGREGATOR_URL = import.meta.env.VITE_AGGREGATOR_URL
export const AGGREGATOR_API_KEY = import.meta.env.VITE_AGGREGATOR_API_KEY
export const TELEGRAM_REDIRECT_URL = import.meta.env.VITE_TELEGRAM_REDIRECT_URL
export const ANQA_ANALYSIS_URL = import.meta.env.VITE_ANQA_ANALYSIS_URL
export const PETRA_ENCRYPTION_PUBLIC_KEY = import.meta.env.VITE_PETRA_ENCRYPTION_PUBLIC_KEY
export const VERSION = 6 // Pump version to purge state.

export const aptosConnectWallet = new AptosConnectWallet({})
export const petraWallet = new PetraWallet()
export const martianWallet = new MartianWallet()
export const pontemWallet = new PontemWallet()
export const okxWallet = new OKXWallet()
export const nightlyWallet = new NightlyWallet()
export const MAINNET_WALLETS: readonly Wallet[] = [
  aptosConnectWallet as any, // NOTE: Library problem.
  petraWallet,
  martianWallet,
  pontemWallet,
  okxWallet,
  nightlyWallet,
]
