import { describe, expect, it } from 'bun:test'
import {
  calculateChaptalization,
  predictFermentation,
  toGallons,
  toLiters,
} from './brewing-math.ts'

describe('predictFermentation', () => {
  it('predicts dry fermentation when potential ABV is within tolerance', () => {
    const result = predictFermentation({
      og: 1.05,
      yeastTolerance: 12.0,
      dryFg: 0.998,
    })

    expect(result.isStalled).toBe(false)
    expect(result.profile).toBe('Dry')
    expect(result.predictedFg).toBeCloseTo(0.998, 3)
    expect(result.expectedAbv).toBeCloseTo((1.05 - 0.998) * 131.25, 2)
  })

  it('predicts stalled fermentation when potential ABV exceeds yeast tolerance', () => {
    const result = predictFermentation({
      og: 1.11,
      yeastTolerance: 11.0,
      dryFg: 0.998,
    })

    expect(result.isStalled).toBe(true)
    expect(result.profile).toBe('Sweet / Incomplete')
    expect(result.expectedAbv).toBe(11.0)
    // stalledFg = 1.110 - (11.0 / 131.25) ~= 1.02619
    expect(result.predictedFg).toBeCloseTo(1.026, 2)
  })

  it('handles OG less than or equal to dryFg gracefully', () => {
    const result = predictFermentation({
      og: 0.998,
      yeastTolerance: 14.0,
      dryFg: 0.998,
    })

    expect(result.potentialAbv).toBe(0)
    expect(result.expectedAbv).toBe(0)
    expect(result.predictedFg).toBe(0.998)
    expect(result.isStalled).toBe(false)
  })
})

describe('calculateChaptalization', () => {
  it('calculates required target OG and table sugar weight in US units', () => {
    // 5 gal, current OG 1.045, target ABV 12%, yeast tolerance 14%, Table Sugar (46 PPG)
    const result = calculateChaptalization({
      batchSize: 5,
      unit: 'us',
      currentOg: 1.045,
      targetAbv: 12.0,
      yeastTolerance: 14.0,
      ppg: 46,
      dryFg: 0.998,
    })

    // targetOg = 0.998 + (12 / 131.25) ~= 1.089428
    expect(result.targetOg).toBeCloseTo(1.0894, 3)
    // points per gal needed = (1.089428 - 1.045) * 1000 ~= 44.428
    expect(result.gravityPointsDeficit).toBeCloseTo(44.43, 1)
    // total points = 44.428 * 5 = 222.14
    expect(result.totalPoints).toBeCloseTo(222.14, 1)
    // lbs = 222.14 / 46 ~= 4.829 lbs
    expect(result.weightLbs).toBeCloseTo(4.829, 2)
    expect(result.displayLbs).toBe(4)
    expect(result.displayOz).toBeCloseTo(13.27, 1)
    expect(result.exceedsTolerance).toBe(false)
  })

  it('flags warning when target ABV exceeds yeast alcohol tolerance', () => {
    const result = calculateChaptalization({
      batchSize: 5,
      unit: 'us',
      currentOg: 1.045,
      targetAbv: 16.0,
      yeastTolerance: 14.0,
      ppg: 46,
      dryFg: 0.998,
    })

    expect(result.exceedsTolerance).toBe(true)
  })

  it('correctly calculates sugar in metric units (Liters to kg/g)', () => {
    // 20 Liters (~5.28 gal)
    const result = calculateChaptalization({
      batchSize: 20,
      unit: 'metric',
      currentOg: 1.045,
      targetAbv: 12.0,
      yeastTolerance: 14.0,
      ppg: 46,
      dryFg: 0.998,
    })

    expect(result.weightKg).toBeGreaterThan(0)
    expect(result.weightGrams).toBeCloseTo(result.weightKg * 1000, 2)
  })

  it('handles target ABV that is already satisfied by current OG', () => {
    const result = calculateChaptalization({
      batchSize: 5,
      unit: 'us',
      currentOg: 1.1,
      targetAbv: 8.0,
      yeastTolerance: 14.0,
      ppg: 46,
      dryFg: 0.998,
    })

    expect(result.weightLbs).toBe(0)
    expect(result.gravityPointsDeficit).toBe(0)
  })
})

describe('unit conversion helpers', () => {
  it('converts between gallons and liters symmetrically', () => {
    const gal = 5
    const liters = toLiters(gal)
    expect(liters).toBeCloseTo(18.927, 2)
    expect(toGallons(liters)).toBeCloseTo(gal, 4)
  })
})
