import { IMartian } from "./martian"
import { IPetra } from "./petra"
import { IPontem } from "./pontem"

declare global {
  interface Window {
    martian: IMartian | undefined
    aptos: IPetra | undefined
    pontem: IPontem | undefined
  }
}

export const martian = window.martian
export const petra = window.aptos
export const pontem = window.pontem

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never
