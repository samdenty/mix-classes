import { Constructable, Mixin, MIXIN_CLASSES, INSTANCE_THIS } from './types'
import { getMixin } from './getMixin'

const extend = (base: any, extension: any) =>
  new Proxy(base, {
    get: (_, prop) => {
      const target = prop in extension ? extension : base

      return target[prop]
    },
    set: (_, prop, value) => {
      const target = prop in extension ? extension : base

      return (target[prop] = value)
    },
  })

export const mix = <TConstructors extends Constructable[], TGenerics = never>(
  ...Classes: TConstructors
) => {
  const MixinClass = class MixinClass {
    static [MIXIN_CLASSES] = Classes;

    // Stores the `this` proxies for each class
    [INSTANCE_THIS] = new WeakMap()

    constructor(...classesArgs: any[]) {
      Classes.forEach((Class, i) => {
        const instance = new Class(...(classesArgs[i] || []))
        const instanceThis = extend(this, instance)

        this[INSTANCE_THIS].set(Class, instanceThis)

        // Copy over getters to instance values
        Object.keys(instance).forEach(key => {
          Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get() {
              return instance[key]
            },
            set(value) {
              return (instance[key] = value)
            },
          })
        })
      })
    }
  }

  Classes.forEach(Class => {
    const restoreThisInsideFunction = (fn: Function) =>
      function(this: typeof MixinClass['prototype'], ...args: any[]) {
        return fn.apply(getMixin(this, Class), args)
      }

    // Copy over prototype methods
    const recursePrototype = (prototype: Constructable['prototype']) => {
      // Add instanceof support
      const hasInstance = prototype.constructor[Symbol.hasInstance]
      Object.defineProperty(prototype.constructor, Symbol.hasInstance, {
        configurable: true,
        value(possibleMixin: typeof MixinClass['prototype']) {
          if (possibleMixin && possibleMixin.constructor) {
            // Babel fix
            if (possibleMixin.constructor === Class) return true

            const mixinClasses = (possibleMixin.constructor as typeof MixinClass)[
              MIXIN_CLASSES
            ]

            if (mixinClasses && mixinClasses.includes(Class)) {
              return true
            }
          }

          return hasInstance(possibleMixin)
        },
      })

      Object.getOwnPropertyNames(prototype).forEach(name => {
        if (name === 'constructor') return

        const descriptor = Object.getOwnPropertyDescriptor(prototype, name)!

        if (descriptor.get) {
          descriptor.get = restoreThisInsideFunction(descriptor.get)
        }

        if (descriptor.set) {
          descriptor.set = restoreThisInsideFunction(descriptor.set)
        }

        if (typeof descriptor.value === 'function') {
          descriptor.value = restoreThisInsideFunction(descriptor.value)
        }

        Object.defineProperty(MixinClass.prototype, name, descriptor)
      })

      const parent = Object.getPrototypeOf(prototype)
      if (parent && parent !== Object.prototype) recursePrototype(parent)
    }

    recursePrototype(Class.prototype)
  })

  return MixinClass as typeof MixinClass & Mixin<TConstructors, TGenerics>
}

mix.generic = <TGenerics = void>() => {
  return <TConstructors extends Constructable[]>(...Classes: TConstructors) => {
    const result = mix<TConstructors, TGenerics>(...Classes)

    return result
  }
}
