declare global {
  interface Window {
    aptos: any
    martian: any
    pontem: any
    okxwallet: any
  }
}

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never
