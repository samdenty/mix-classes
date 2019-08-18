import * as mixExports from '../src'
import { Generic, getMixin, Mix } from '../src'

Object.assign(window, mixExports)

class Base {}
class ExtendedBase extends Base {}

class A extends Mix(ExtendedBase) {}

class B extends Base {}

console.log(new B() instanceof B, new B() instanceof Base)
console.log(
  new A() instanceof A,
  new A() instanceof ExtendedBase,
  new A() instanceof Base
)
