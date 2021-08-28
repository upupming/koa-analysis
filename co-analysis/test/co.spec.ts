import co from 'co'

describe('co example 1.1: single of promise', () => {
  it('should work as documented', async () => {
    function * gen (a: number, b: string, c: boolean): Generator<Promise<boolean>, boolean, boolean> {
      expect(a).toEqual(1)
      expect(b).toEqual('2')
      expect(c).toEqual(true)
      const r1 = yield Promise.resolve(false)
      expect(r1).toEqual(false)
      const r2 = yield Promise.resolve(true)
      expect(r2).toEqual(true)
      return r2
    }
    await co(gen, 1, '2', true)
      .then(function (value) {
        expect(value).toEqual(true)
      }, function (err) {
        console.error(err.stack)
      })
  })
  it('should same as async/await', async () => {
    const fun = async (a: number, b: string, c: boolean): Promise<boolean> => {
      expect(a).toEqual(1)
      expect(b).toEqual('2')
      expect(c).toEqual(true)
      const r1 = await Promise.resolve(false)
      expect(r1).toEqual(false)
      const r2 = await Promise.resolve(true)
      expect(r2).toEqual(true)
      return r2
    }
    await fun(1, '2', true)
      .then(function (value) {
        expect(value).toEqual(true)
      }, function (err) {
        console.error(err.stack)
      })
  })
})

describe('co example 1.2: array of promise', () => {
  it('should support array of promises', async () => {
    await co(function * (): Generator<[Promise<number>, Promise<number>, Promise<number>], [number, number, number], [number, number, number]> {
      // resolve multiple promises in parallel
      const a = Promise.resolve(1)
      const b = Promise.resolve(2)
      const c = Promise.resolve(3)
      const res = yield [a, b, c]
      return res
    }).then(value => {
      expect(value).toEqual([1, 2, 3])
    })
  })
  it('should same as Promise.all', async () => {
    const a = Promise.resolve(1)
    const b = Promise.resolve(2)
    const c = Promise.resolve(3)
    await Promise.all([a, b, c]).then(value => {
      expect(value).toEqual([1, 2, 3])
    })
  })
})

describe('co example 1.3: error handling', () => {
  it('should throw error', async () => {
    await co(function * () {
      try {
        yield Promise.reject(new Error('boom'))
      } catch (err) {
        expect(err.message).toEqual('boom')
      }
    })
  })
  it('should same as async/await try-catch', async () => {
    try {
      await Promise.reject(new Error('boom'))
    } catch (err) {
      expect(err.message).toEqual('boom')
    }
  })
})

describe('co example 1.4: objects', () => {
  it('should support objects', async () => {
    await co(function * () {
      const res = yield {
        1: Promise.resolve(1),
        2: Promise.resolve(2)
      }
      return res
    }).then(res => {
      expect(res).toEqual({ 1: 1, 2: 2 })
    })
  })
  it('should same as Promise.all and Object.fromEntries', async () => {
    const obj = {
      1: Promise.resolve(1),
      2: Promise.resolve(2)
    }
    // keys 和 values 顺序保持一致很重要: https://stackoverflow.com/a/52706191/8242705
    const tmp = await Promise.all(Object.values(obj))
    const res = Object.fromEntries(Object.keys(obj).map((key, idx) => [key, tmp[idx]]))
    expect(res).toEqual({ 1: 1, 2: 2 })
  })
})

describe('co example 2.1: co.wrap', () => {
  it('should return a function', async () => {
    const fn = co.wrap(function * (val) {
      return yield Promise.resolve(val)
    })

    await fn(true).then(function (val) {
      expect(val).toEqual(true)
    })
  })
  it('should same as async/await', async () => {
    const fn = async (val): Promise<any> => {
      return await Promise.resolve(val)
    }
    await fn(true).then(function (val) {
      expect(val).toEqual(true)
    })
  })
})

// function * gen (num: number, str: string, arr: number[], obj: object, fun: () => void): Generator<undefined, number, undefined> {
//   return num
// }
// co(gen, 42, 'forty-two', [42], { value: 42 }, () => {})
//   .then((num: number) => {}, (err: Error) => {})
//   .catch((err: Error) => {})
