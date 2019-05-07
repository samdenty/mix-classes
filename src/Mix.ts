import { Mixable } from './types'
import { createMixinClass } from './createMixinClass'

export const Mix = <TMixables extends Mixable[]>(...Mixables: TMixables) =>
  createMixinClass(Mixables)
