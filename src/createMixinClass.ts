import { getMixin } from './getMixin'
import { Constructable, Mixable, Mixin } from './types'

export const INSTANCE_THIS = Symbol('instanceThis')
export const MIXIN_CLASSES = Symbol('mixinClasses')

const extend = (base: any, extension: any) =>
  new Proxy(base, {
    get: (_, prop) => {
      const target = prop in extension ? extension : base

      return target[prop]
    },
    set: (_, prop, value) => {
      const target = prop in extension ? extension : base
      target[prop] = value

      return true
    },
  })

const extractConstructable = (Mixable: Mixable): Constructable =>
  'prototype' in Mixable ? Mixable : Mixable.Class

export const createMixinClass = <TMixables extends Mixable[]>(
  Mixables: TMixables
) => {
  const Classes = Mixables.map(extractConstructable)

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
          // Retain original instanceof for prototype
          if (prototype.isPrototypeOf(possibleMixin)) return true

          if (possibleMixin && possibleMixin.constructor) {
            const isInMixins = (mixin: any): boolean => {
              const classes = mixin[MIXIN_CLASSES]
              if (!classes) return false
              for (const cls of classes) {
                if (cls === Class) return true
                const isChildMixin = isInMixins(cls)
                if (isChildMixin) return true
              }
              return false
            }

            if (this && this !== prototype.constructor) {
              // not used as mixin, `class [this] extends [prototype.constructor] {}`

              return prototype.constructor.isPrototypeOf(
                possibleMixin.constructor
              )
            }

            if (isInMixins(possibleMixin.constructor)) return true

            if (!this) return false
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

        if (!MixinClass.prototype.hasOwnProperty(name)) {
          Object.defineProperty(MixinClass.prototype, name, descriptor)
        }
      })

      const parent = Object.getPrototypeOf(prototype)
      if (parent && parent !== Object.prototype) recursePrototype(parent)
    }

    recursePrototype(Class.prototype)
  })

  return (MixinClass as any) as Mixin<TMixables>
}
