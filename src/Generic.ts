import { Constructable } from './types'

export type IGeneric<TConstructable extends Constructable = any> = {
  Class: TConstructable
}

export const Generic = <TConstructable extends Constructable>(
  Class: TConstructable
): IGeneric<TConstructable> => ({
  Class,
})
