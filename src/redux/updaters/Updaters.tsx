import { ReactNode, useEffect, useState } from 'react'
import { VERSION } from '../../constants'
import { useAppSelector } from '../hooks'
import { persistor } from '../store'
import PriceUpdater from './PriceUpdater'
import TokenUpdater from './TokenUpdater'
import WalletUpdater from './WalletUpdater'
import TelegramUpdater from './TelegramUpdater'

export default function Updaters({ children }: { children: ReactNode }) {
  const version = useAppSelector((state) => state.user.version)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fn = async () => {
      try {
        if (version !== VERSION) {
          setIsLoading(true)
          await persistor.purge()
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    void fn()
  }, [version])

  if (isLoading) return null

  return (
    <>
      <WalletUpdater />
      <TokenUpdater />
      <PriceUpdater />
      <TelegramUpdater />
      {children}
    </>
  )
}
