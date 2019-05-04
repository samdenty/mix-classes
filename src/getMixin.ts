import { Constructable, INSTANCE_THIS } from './types'

/**
 * Gets a specific mixin's `this`
 * @param instance The this object to search on
 * @param MixinClass The mixin you want to find
 */
export const getMixin = <TConstructable extends Constructable>(
  instance: any,
  MixinClass: TConstructable
): TConstructable['prototype'] | undefined => {
  if (instance && instance[INSTANCE_THIS]) {
    return instance[INSTANCE_THIS].get(MixinClass)
  }
  return undefined
}
