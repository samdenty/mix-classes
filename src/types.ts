export const INSTANCE_THIS = Symbol('instanceThis')
export const MIXIN_CLASSES = Symbol('mixinClasses')

type NewableParameters<T extends any> = T extends new (...args: infer P) => any
  ? P
  : never

type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never

export interface Constructable {
  new (...args: any): any
  prototype: any
}

type MixinParameters<TConstructors extends Constructable[]> = {
  [K in keyof TConstructors]?: NewableParameters<TConstructors[K]>
}

export interface Mixin<TConstructors extends Constructable[]> {
  new (...args: MixinParameters<TConstructors>): UnionToIntersection<
    TConstructors[number]['prototype']
  >
}
