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
