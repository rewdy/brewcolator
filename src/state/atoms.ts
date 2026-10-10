import { atomWithStorage } from 'jotai/utils'
import type { UnitSystem } from '../lib/brewing-math.ts'
import { DEFAULT_DRY_FG } from '../lib/brewing-math.ts'

export const unitSystemAtom = atomWithStorage<UnitSystem>(
  'brewcolator:unit-system',
  'us',
)

export const defaultDryFgAtom = atomWithStorage<number>(
  'brewcolator:default-dry-fg',
  DEFAULT_DRY_FG,
)
