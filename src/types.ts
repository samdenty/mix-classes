export const INSTANCE_THIS = Symbol('instanceThis')
export const MIXIN_CLASSES = Symbol('mixinClasses')

type NewableParameters<T extends any> = T extends new (...args: infer P) => any
  ? P
  : never

export interface Constructable {
  new (...args: any): any
  prototype: any
}

type MixinParameters<TConstructors extends Constructable[]> = {
  [K in keyof TConstructors]?: NewableParameters<TConstructors[K]>
}

type ReplaceGenericlessPrototypes<Genericless extends any, Generics> = {
  [K in keyof Genericless]: Extract<
    Generics,
    Genericless[K]['prototype']
  > extends never
    ? Genericless[K]['prototype']
    : Extract<Generics, Genericless[K]['prototype']>
}

export interface Mixin<TConstructors extends Constructable[], Generics> {
  new (...args: MixinParameters<TConstructors>): ArrayToIntersection<
    ReplaceGenericlessPrototypes<TConstructors, Generics>
  >
}

type Idx<T extends any, K extends keyof any, Yes> = T extends Record<K, any>
  ? T[K] & Yes
  : unknown

export type ArrayToIntersection<T extends any[]> = Idx<
  T,
  '0',
  Idx<
    T,
    '1',
    Idx<
      T,
      '2',
      Idx<
        T,
        '3',
        Idx<
          T,
          '4',
          Idx<
            T,
            '5',
            Idx<T, '6', Idx<T, '7', Idx<T, '8', Idx<T, '9', unknown>>>>
          >
        >
      >
    >
  >
>
