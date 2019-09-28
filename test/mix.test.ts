import { Generic, getMixin, Mix } from '../src'

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

class B<T extends string> extends BaseMix {
  public bType: T = null as any

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

interface Derived extends B<'b'> {}

class Derived extends Mix(A, Generic(B), C) {
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

test('Retains original instanceof behaviour', () => {
  class Base {}
  class ExtendedBase extends Base {}

  class A extends Mix(ExtendedBase) {}
  class B extends Base {}

  expect(new Base() instanceof Object).toBeTruthy()
  expect(new ExtendedBase() instanceof Object).toBeTruthy()
  expect(new A() instanceof Object).toBeTruthy()
  expect(new B() instanceof Object).toBeTruthy()

  expect(new B() instanceof B).toBeTruthy()
  expect(new B() instanceof Base).toBeTruthy()

  expect(new ExtendedBase() instanceof ExtendedBase).toBeTruthy()
  expect(new ExtendedBase() instanceof Base).toBeTruthy()

  expect(new Base() instanceof Base).toBeTruthy()

  expect(new B() instanceof Function).toBeFalsy()
  expect(new A() instanceof Function).toBeFalsy()
})

test('works at any extension deep', () => {
  class D {}
  class C extends Mix(D) {}
  class B extends Mix(C) {}
  class A extends Mix(B) {}

  const a = new A()

  expect(a instanceof A).toBeTruthy()
  expect(a instanceof B).toBeTruthy()
  expect(a instanceof C).toBeTruthy()
  expect(a instanceof D).toBeTruthy()
})

test('supports super in extended classes', () => {
  class A {
    _() {
      return 'A'
    }
  }

  class B extends A {
    _() {
      return `${super._()}B`
    }
  }

  class C extends B {
    _() {
      return `${super._()}C`
    }
  }
  class D extends Mix(C) {
    _() {
      return `${super._()}D`
    }
  }

  expect(new D()._()).toEqual('ABCD')
})

test(`hasInstance returns false for normal extends`, () => {
  class Base {}

  class MixExtends extends Mix(Base) {}
  class NormalExtends extends Base {}

  const mixExtends = new MixExtends()

  expect(mixExtends instanceof NormalExtends).toBeFalsy()
})

test(`doesn't overwrite previous hasInstance's`, () => {
  class Base {}

  class A extends Base {}
  class B extends Mix(Base) {}
  class C extends Mix(A) {}

  var a = new A()
  var b = new B()
  var c = new C()

  expect(a instanceof Base).toBeTruthy()
  expect(b instanceof Base).toBeTruthy()
  expect(c instanceof Base).toBeTruthy()
})
