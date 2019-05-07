# mix-classes

Easily add typescript-safe mixins to JS classes, with support for constructors, overloading and more. Correctly handles `this` for each class, so it'll work with anything.

```ts
import { mix } from 'mix-classes'

class Contactable {
  constructor(public email: string, public phone?: string) {}
}
class Nameable {
  constructor(public name: string) {}
}
class Website {
  constructor(public websiteUrl: string) {}
}

class Developer extends mix(Nameable, Contactable, Website) {
  constructor() {
    super(['Bob'], ['hi@example.com'], ['https://example.com'])
  }
}

class Company extends mix(Nameable, Contactable) {
  constructor() {
    super(['Apple'], ['hi@apple.com', '18-00'], ['https://apple.com'])
  }
}

const developer = new Developer()
developer.name
developer.email
developer.websiteUrl

const company = new Company()
company.name
company.email
company.phone
company.websiteUrl
```

## Constructor arguments

You can pass custom constructor arguments to each mixin within an array inside the `super` call. The arguments order is dependant on the `mix` array order.

```ts
import { mix } from 'mix-classes'

class Nameable {
  constructor(public name: string) {}
}

class Ageable {
  constructor(public age: number) {}
}

class Person extends mix(Nameable, Ageable) {
  constructor() {
    super(['Bob'], [50])
    //     ^ name argument for Nameable
    //              ^ age argument for Ageable
  }
}
```

## Overloading

All mixins are seperate classes with different `this` values, meaning you don't need to worry about name collisions.

```ts
import { mix, getMixin } from 'mix-classes'

class A {
  variable = 'a'
  public a() {
    return this.variable
  }
}

class B {
  variable = 'b'
  public b() {
    return this.variable
  }
}

class Test extends mix(A, B) {
  constructor() {
    super()

    // The default value is the last mixin specified
    console.log(this.variable) // 'b'

    // Use getMixin to get overloaded properties
    console.log(getMixin(this, A).variable) // 'a'

    // Mixins retain access to their local variables
    this.a() // 'a'
    this.b() // 'b'
  }
}

const test = new Test()
```

## Typescript generics

Typescript generics are supported, but it requires making an extra function call to `mix.generic`

```ts
import { mix, getMixin } from 'mix-classes'

class B {}

class Role<Type extends string> {
  constructor(public type: Type) {}
}

class User<Username extends string> {
  constructor(public username: Username) {}
}

class Admin extends mix.generic<User<'bob'> | Role<'admin'>()(User, Role) {
  constructor() {
    super(['bob'], ['admin'])
  }
}

const test = new Admin()
test.username // type 'bob'
```
