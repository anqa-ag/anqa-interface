import { BigintIsh, Fraction } from "./fraction"

export function toFraction(j: BigintIsh, decimals: number): Fraction {
  return new Fraction(j, Math.pow(10, decimals))
}

export function truncateValue(value: string, decimals: number): string {
  const parts = value.split(/[.,]/)
  const symbol = value.includes(".") ? "." : ","
  if (parts.length > 1 && parts[1].length > decimals) {
    return parts[0] + symbol + parts[1].slice(0, decimals)
  }
  return value
}

export const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

export function numberWithCommas(x: string) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
