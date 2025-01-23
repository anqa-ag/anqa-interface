import { useCallback } from 'react'
import { isUserTransactionResponse } from '@aptos-labs/ts-sdk'
import invariant from 'tiny-invariant'
import { useShowToastWithExplorerLink } from './useSwapNotificationFn.tsx'
import { Asset } from '../redux/slices/asset.ts'
import useAnqaWallet from './useAnqaWallet.ts'
import { aptos } from '../utils/aptos.ts'
import { PartialRecord } from '../types.ts'

export default function useMigrateToken() {
  const { account, signAndSubmitTransaction } = useAnqaWallet()

  const sendNotification = useShowToastWithExplorerLink()

  return useCallback(
    async ({ token }: { token: Asset }) => {
      if (!account || !token?.coinType) return
      try {
        const response: {
          hash: string
          output: PartialRecord<string, any>
        } = await signAndSubmitTransaction({
          sender: account.address,
          data: {
            function: `0x1::coin::migrate_to_fungible_store`,
            functionArguments: [],
            typeArguments: [token.coinType],
          },
        })

        const hash = response.hash

        const receipt = await aptos.waitForTransaction({
          transactionHash: hash,
          options: {
            checkSuccess: false,
            timeoutSecs: 2,
            waitForIndexer: true,
          },
        })
        invariant(isUserTransactionResponse(receipt), 'isUserTransactionResponse(receipt) failed')
        sendNotification({ isSuccess: true, txNumber: receipt.version, msg: `Migrate ${token.symbol} successfully` })
      } catch (err) {
        console.error(err)
        sendNotification({
          isSuccess: false,
          msg: `Migrate ${token.symbol} failed`,
          error: err,
        })
      }
    },
    [account, signAndSubmitTransaction, sendNotification],
  )
}
