import { mix, getMixin } from '../src'
import { Constructable } from '../src/types'

class BaseMix {
  constructor(public baseValue: string) {}

  public chain() {
    return this
  }

  public base() {
    return this.baseValue
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

  public base() {
    console.log('called')
    return super.base()
  }

  public getB() {
    console.log('get B called', this.local)
    return super.getB()
  }

  public derivedB() {
    const bThis = getMixin(this, B)
    console.log(bThis.local)
  }
}

const derived = new Derived()
const derivedA = getMixin(derived, A)
const derivedB = getMixin(derived, B)
derived.derivedB()

derived.getA()
derived.getB()

Object.assign(window, {
  derived,
  derivedA,
  derivedB,
  Derived,
  BaseMix,
  A,
  B,
  C,
})
