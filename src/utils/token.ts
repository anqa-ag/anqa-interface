import { Asset } from '../redux/slices/asset.ts'

export const getTokenAddress = (token: Asset | undefined) =>
  !token ? '' : token.type === 'legacy' ? (token.coinType ?? '') : token.faAddress
export const getShortAddress = (address: string, options?: { start?: number; end?: number }) => {
  const { start = 7, end = 5 } = options || {}

  if (!address) {
    return ''
  }

  if (address.length <= start + end) {
    return address
  }

  return address.substr(0, start) + '...' + address.substr(address.length - end, address.length)
}
