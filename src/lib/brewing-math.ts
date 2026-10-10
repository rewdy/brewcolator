export type UnitSystem = 'us' | 'metric'

export interface FermentableInfo {
  id: string
  name: string
  ppg: number
  description?: string
}

export const FERMENTABLES: readonly FermentableInfo[] = [
  { id: 'table-sugar', name: 'Table Sugar (Sucrose)', ppg: 46 },
  { id: 'corn-sugar', name: 'Corn Sugar (Dextrose)', ppg: 42 },
  { id: 'honey', name: 'Honey', ppg: 35 },
  { id: 'maple-syrup', name: 'Maple Syrup', ppg: 30 },
  { id: 'brown-sugar', name: 'Brown Sugar', ppg: 45 },
  { id: 'dme', name: 'Dry Malt Extract (DME)', ppg: 44 },
  { id: 'custom', name: 'Custom Fermentable', ppg: 46 },
] as const

export const DEFAULT_DRY_FG = 0.998
export const ABV_MULTIPLIER = 131.25
export const LITERS_PER_GALLON = 3.785411784
export const GRAMS_PER_POUND = 453.59237
export const OUNCES_PER_POUND = 16

export interface PredictionInput {
  og: number
  yeastTolerance: number
  dryFg?: number
}

export interface PredictionResult {
  potentialAbv: number
  expectedAbv: number
  predictedFg: number
  isStalled: boolean
  profile: 'Dry' | 'Sweet / Incomplete'
}

export function predictFermentation(input: PredictionInput): PredictionResult {
  const dryFg = input.dryFg ?? DEFAULT_DRY_FG
  const og = input.og
  const tolerance = input.yeastTolerance

  if (og <= dryFg) {
    return {
      potentialAbv: 0,
      expectedAbv: 0,
      predictedFg: og,
      isStalled: false,
      profile: 'Dry',
    }
  }

  const potentialAbv = (og - dryFg) * ABV_MULTIPLIER

  if (potentialAbv <= tolerance) {
    return {
      potentialAbv,
      expectedAbv: potentialAbv,
      predictedFg: dryFg,
      isStalled: false,
      profile: 'Dry',
    }
  }

  const stalledFg = og - tolerance / ABV_MULTIPLIER
  return {
    potentialAbv,
    expectedAbv: tolerance,
    predictedFg: Math.max(dryFg, stalledFg),
    isStalled: true,
    profile: 'Sweet / Incomplete',
  }
}

export interface ChaptalizationInput {
  batchSize: number
  unit: UnitSystem
  currentOg: number
  targetAbv: number
  yeastTolerance: number
  ppg: number
  dryFg?: number
}

export interface ChaptalizationResult {
  targetOg: number
  gravityPointsDeficit: number
  totalPoints: number
  weightLbs: number
  weightOzTotal: number
  displayLbs: number
  displayOz: number
  weightKg: number
  weightGrams: number
  exceedsTolerance: boolean
}

export function calculateChaptalization(input: ChaptalizationInput): ChaptalizationResult {
  const dryFg = input.dryFg ?? DEFAULT_DRY_FG
  const targetOg = dryFg + input.targetAbv / ABV_MULTIPLIER
  const pointsPerGalNeeded = Math.max(0, (targetOg - input.currentOg) * 1000)

  const volumeGallons =
    input.unit === 'metric'
      ? input.batchSize / LITERS_PER_GALLON
      : input.batchSize

  const totalPoints = pointsPerGalNeeded * volumeGallons
  const ppg = input.ppg > 0 ? input.ppg : 46
  const weightLbs = totalPoints / ppg
  const weightOzTotal = weightLbs * OUNCES_PER_POUND
  const displayLbs = Math.floor(weightLbs)
  const displayOz = Math.max(0, (weightLbs - displayLbs) * OUNCES_PER_POUND)

  const weightGrams = weightLbs * GRAMS_PER_POUND
  const weightKg = weightGrams / 1000

  const exceedsTolerance = input.targetAbv > input.yeastTolerance

  return {
    targetOg,
    gravityPointsDeficit: pointsPerGalNeeded,
    totalPoints,
    weightLbs,
    weightOzTotal,
    displayLbs,
    displayOz,
    weightKg,
    weightGrams,
    exceedsTolerance,
  }
}

export function toGallons(liters: number): number {
  return liters / LITERS_PER_GALLON
}

export function toLiters(gallons: number): number {
  return gallons * LITERS_PER_GALLON
}
