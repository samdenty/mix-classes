import * as mixExports from '../src'
import { Generic, getMixin, Mix } from '../src'

class D {}
class C extends Mix(D) {}
class B extends Mix(C) {}
class A extends Mix(B) {}

const a = new A()
Object.assign(window, mixExports, { A, B, C, D, a })

console.group({
  A: a instanceof A,
})
console.groupEnd()
console.group({
  B: a instanceof B,
})
console.groupEnd()
console.group({
  C: a instanceof C,
})
console.groupEnd()
console.group({
  D: a instanceof D,
})
console.groupEnd()
