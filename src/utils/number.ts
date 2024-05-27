import { parseUnits } from "@ethersproject/units"
import { BigintIsh, Fraction } from "./fraction"

// n = "10000000000000000000", decimals = 9 => Fraction("10000000000000000000", 1e9)
export function divpowToFraction(n: BigintIsh, decimals: number): Fraction {
  return new Fraction(n, Math.pow(10, decimals))
}

// Float in string form to Fraction.
// s = "0.000000000000001", multiplier = 18 => Fraction("1000", 1e18)
export function mulpowToFraction(s: string, multiplier = 18): Fraction {
  const f = new Fraction(parseUnits(truncateValue(s, multiplier), multiplier).toString(), Math.pow(10, multiplier))
  return f
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
