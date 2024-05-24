import { BigintIsh, Fraction } from "./fraction"

export const toFraction = (j: BigintIsh, decimals: number): Fraction => {
  return new Fraction(j, Math.pow(10, decimals))
}
