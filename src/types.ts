declare global {
    interface Window {
        aptos: any;
        martian: any;
        pontem: any;
        okxwallet: any;
        nightly: any;
    }
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};
