import { IGeneric } from './Generic'

type NewableParameters<T extends any> = T extends new (...args: infer P) => any
  ? P
  : never

export interface Constructable {
  new (...args: any): any
  prototype: any
}

export type Mixable = Constructable | IGeneric

type ExtractConstructable<TMixable extends Mixable> = TMixable extends IGeneric<
  infer TConstructable
>
  ? TConstructable
  : TMixable

type MixinParameters<TMixables extends Mixable[]> = {
  [K in keyof TMixables]?: TMixables[K] extends Mixable
    ? NewableParameters<ExtractConstructable<TMixables[K]>>
    : TMixables[K]
}

type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never

type MixinInstance<TMixables extends Mixable[]> = UnionToIntersection<
  {
    [K in keyof TMixables]: TMixables[K] extends Constructable
      ? TMixables[K]
      : never
  }[number]['prototype']
>

export interface Mixin<TMixables extends Mixable[]> {
  new (...args: MixinParameters<TMixables>): MixinInstance<TMixables>
}
