# mix-classes

Easily add typescript-safe mixins to JS classes, with support for generics, constructors, overloading and more. Correctly handles `this` for each class, so it'll work with anything.

- Allows you to use Typescript generics
- You can use constructors in mixins, allowing you to pass arguments
- Supports `super` calls in overloaded methods
- Handles the `this` inside classes, so that they always access their local scope first. No need to worry about name-collisions

```ts
import { Mix } from 'mix-classes'

class Contactable {
  constructor(public email: string, public phone?: string) {}
}
class Nameable {
  constructor(public name: string) {}
}
class Website {
  constructor(public websiteUrl: string) {}
}

class Developer extends Mix(Nameable, Contactable, Website) {
  constructor() {
    super(['Bob'], ['hi@example.com'], ['https://example.com'])
  }
}

class Company extends Mix(Nameable, Contactable) {
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
import { Mix } from 'mix-classes'

class Nameable {
  constructor(public name: string) {}
}

class Ageable {
  constructor(public age: number) {}
}

class Person extends Mix(Nameable, Ageable) {
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
import { Mix, getMixin } from 'mix-classes'

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

class Test extends Mix(A, B) {
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

Typescript generics are supported, but it requires using Typescript's declaration merging.

To use them, simply wrap the class that you want to pass generics to in `Generic()`, and then add an interface with the same name as the class you want it in.

Before:

```ts
import { Mix } from 'mix-classes'

class MyClass extends Mix(User, Nameable, Ageable) {}
```

After:

```ts
import { Generic, Mix } from 'mix-classes'

interface MyClass extends User<'bob'> {}
class MyClass extends Mix(Generic(User), Nameable, Ageable) {}
```

```ts
import { Mix, Generic } from 'mix-classes'

class B {}

class Role<Type extends string> {
  constructor(public type: Type) {}
}

class User<Username extends string> {
  constructor(public username: Username) {}
}

interface Admin extends User<'bob'>, Role<'admin'> {}

class Admin extends Mix(Generic(User), Generic(Role), B) {
  constructor() {
    super(['bob'], ['admin'])
  }
}

const test = new Admin()
test.username // type 'bob'
```
