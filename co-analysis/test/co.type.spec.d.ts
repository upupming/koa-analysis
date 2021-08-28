// 来自 type-challenges 的辅助函数
export type Expect<T extends true> = T

export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

/**
 * 传入一个可迭代对象类型 `I`，返回这个可迭代对象最终的 return 类型
 * 如果是函数，则返回函数的返回值
 * 如果是别的类型，直接返回 I 本身
 * 关于迭代器和生成器的类型使用方法详见: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-6.html
 */

type ExtractType<I> = I extends { [Symbol.iterator]: () => Iterator<any, infer TReturn, any> } ? TReturn :
  I extends (...args: any[]) => any[] ? ReturnType<I> : I

// 注意 TS 里面的 Generator 继承自 Iterator，本质上还是一个可迭代对象，GeneratorFunction 才是生成函数的类型定义
// yield number, return string, next boolean
type A = ExtractType<Generator<number, string, boolean>>
// yield number, no return, next boolean
type B = ExtractType<Generator<number, undefined, boolean>>
// no yield number, return string, next boolean
type C = ExtractType<Generator<undefined, string, boolean>>

export type extractTypeCases = [
  // 可以看到 ExtractType 拿出来的都是 TReturn 类型
  Expect<Equal<A, string>>,
  Expect<Equal<B, undefined>>,
  Expect<Equal<C, string>>,
]

/**
 * 接下来是 co 自己的类型声明，是一个函数，有泛型 `F`
 * 传入的类型 `F` 是一个返回生成器的函数，所以很自然地可以是 Generator Function
 * 传入的参数 `args` 是 `F` 的参数类型
 * 返回一个 Promise，Promise 的返回值是 `F` 返回的生成器的 `ExtractType` 结果
 */
// type Co<F extends (...args: any[]) => Iterator<any>> = (fn: F, ...args: Parameters<F>) => Promise<ExtractType<ReturnType<F>>>

type Co<F extends (...args: any[]) => Iterator<any, any, any>> = (fn: F, ...args: Parameters<F>) => Promise<ExtractType<ReturnType<F>>>

function * d (x: number, y: string, z: boolean): Generator<boolean, string, number> {
  const ret = yield false
  console.log('a', ret)
  return '1'
}

type D = typeof d
// 把 D 作为参数传给 Co 的时候，看一下返回类型
type E = ReturnType<Co<D>>

type F = () => Generator<boolean, undefined, number>
type G = ReturnType<Co<F>>
type H = () => Generator<undefined, string, number>
type I = ReturnType<Co<H>>
// 可以看到最终 Co 函数的返回类型就是 Promise<yield | return>
export type coCases = [
  Expect<Equal<E, Promise<string>>>,
  Expect<Equal<G, Promise<undefined>>>,
  Expect<Equal<I, Promise<string>>>,
]

/**
 * Co['wrap'] 的话类型和 Co 是一模一样的，只是柯里化了一下，就不做介绍了
 */
