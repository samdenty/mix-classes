import * as mixExports from '../src'
import { Generic, getMixin, Mix } from '../src'

class A {
  a() {
    return 'A'
  }
}

class B extends A {
  a() {
    return `${super.a()}B`
  }
}
class C extends Mix(B) {
  a() {
    return `${super.a()}C`
  }
}

const b = new B()
b.a()

Object.assign(window, mixExports, { A, B })
