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

  public get bGetter() {
    return this.local
  }

  public getB() {
    return this.local
  }
}

class C extends BaseMix {
  public local = 'c'

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

  public derivedB() {
    const bThis = getMixin(this, B)
    console.log(bThis.local)
  }
}

const derived = new Derived()
derived.derivedB()

Object.assign(window, {
  derived,
  Derived,
  BaseMix,
  A,
  B,
  C,
})
