import { mix, getMixin } from '../src'

class BaseMix {
  constructor(public baseValue: string) {}

  public chain() {
    return this
  }
}

class A extends BaseMix {
  constructor(baseMix: string) {
    super(baseMix)
  }

  public local = 'a'

  public chainA() {
    return super.chain()
  }

  public get aGetter() {
    return this.local
  }

  public getA() {
    return this.local
  }
}

class B extends BaseMix {
  constructor() {
    super('b')
  }
  public local = 'b'

  public chainB() {
    return super.chain()
  }

  public get bGetter() {
    return this.local
  }

  public getB() {
    return this.local
  }
}

class C extends BaseMix {
  public local = 'c'

  public chainC() {
    return super.chain()
  }

  public get cGetter() {
    return this.local
  }

  public getC() {
    return this.local
  }
}

class Derived extends mix(A, B, C) {
  constructor() {
    super(['a'], undefined, ['c'])
  }
}

const derived = new Derived()

test('Chooses the last mixin for overloaded properties', () => {
  expect(derived.local).toEqual('c')
})

test('Passes constructor arguments', () => {
  expect(derived.baseValue).toEqual('c')
})

test('Gets the correct instance variable inside functions', () => {
  expect(derived.getA()).toEqual('a')
  expect(derived.getB()).toEqual('b')
  expect(derived.getC()).toEqual('c')
})

test('Gets the correct instance variable inside getters', () => {
  expect(derived.aGetter).toEqual('a')
  expect(derived.bGetter).toEqual('b')
  expect(derived.cGetter).toEqual('c')
})

test('Gets the correct instance variable when chained', () => {
  expect(derived.chainA().baseValue).toEqual('a')
  expect(derived.chainB().baseValue).toEqual('b')
  expect(derived.chainC().baseValue).toEqual('c')
})

test('Supports instanceof checks', () => {
  expect(derived instanceof Derived).toBeTruthy()
  expect(derived instanceof A).toBeTruthy()
  expect(derived instanceof B).toBeTruthy()
  expect(derived instanceof C).toBeTruthy()
  expect(derived instanceof Derived).toBeTruthy()
  expect(derived instanceof BaseMix).toBeTruthy()
  expect(derived instanceof Object).toBeTruthy()

  expect(derived instanceof Function).toBeFalsy()
})

test('Supports looking up specific mixins', () => {
  expect(getMixin(derived, A)!.local).toEqual('a')
  expect(getMixin(derived, B)!.local).toEqual('b')
  expect(getMixin(derived, C)!.local).toEqual('c')
})