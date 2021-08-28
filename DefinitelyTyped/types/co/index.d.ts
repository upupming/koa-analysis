// Type definitions for co 4.6
// Project: https://github.com/tj/co#readme
// Definitions by: Doniyor Aliyev <https://github.com/doniyor2109>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.1

// Generator<T, TReturn, TNext> => TReturn
// Function => Promise<ReturnType<Function>>
// others => Promise<others>
type ExtractType<I> = I extends { [Symbol.iterator]: () => Iterator<any, infer TReturn, any> } ? TReturn :
I extends (...args: any[]) => any ? Promise<ReturnType<I>> : Promise<I>

interface Co {
    <F extends (...args: any[]) => Iterator<any, any, any>>(fn: F, ...args: Parameters<F>): Promise<ExtractType<ReturnType<F>>>;
    default: Co;
    co: Co;
    wrap: <F extends (...args: any[]) => Iterator<any, any, any>>(fn: F) => (...args: Parameters<F>) => Promise<ExtractType<ReturnType<F>>>;
}

declare const co: Co;

export = co;
