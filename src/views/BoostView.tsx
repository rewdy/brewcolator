import {
  Alert,
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useAtomValue } from 'jotai'
import { AlertTriangle, CheckCircle2, Scale } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  calculateChaptalization,
  FERMENTABLES,
} from '../lib/brewing-math.ts'
import { defaultDryFgAtom, unitSystemAtom } from '../state/atoms.ts'

export function BoostView() {
  const unitSystem = useAtomValue(unitSystemAtom)
  const defaultDryFg = useAtomValue(defaultDryFgAtom)

  // Form State
  const [batchSize, setBatchSize] = useState<number | string>(unitSystem === 'us' ? 5 : 19)
  const [currentOg, setCurrentOg] = useState<number | string>(1.045)
  const [targetAbv, setTargetAbv] = useState<number | string>(12.0)
  const [yeastTolerance, setYeastTolerance] = useState<number | string>(14.0)
  const [selectedFermentableId, setSelectedFermentableId] = useState<string>('table-sugar')
  const [customPpg, setCustomPpg] = useState<number | string>(46)

  const numBatchSize = typeof batchSize === 'number' ? batchSize : parseFloat(String(batchSize)) || 5
  const numCurrentOg = typeof currentOg === 'number' ? currentOg : parseFloat(String(currentOg)) || 1.045
  const numTargetAbv = typeof targetAbv === 'number' ? targetAbv : parseFloat(String(targetAbv)) || 12.0
  const numYeastTol = typeof yeastTolerance === 'number' ? yeastTolerance : parseFloat(String(yeastTolerance)) || 14.0
  const numCustomPpg = typeof customPpg === 'number' ? customPpg : parseFloat(String(customPpg)) || 46

  const selectedFermentable = useMemo(() => {
    return FERMENTABLES.find((f) => f.id === selectedFermentableId) ?? FERMENTABLES[0]
  }, [selectedFermentableId])

  const activePpg = selectedFermentableId === 'custom' ? numCustomPpg : selectedFermentable.ppg

  const result = useMemo(() => {
    return calculateChaptalization({
      batchSize: numBatchSize,
      unit: unitSystem,
      currentOg: numCurrentOg,
      targetAbv: numTargetAbv,
      yeastTolerance: numYeastTol,
      ppg: activePpg,
      dryFg: defaultDryFg,
    })
  }, [numBatchSize, unitSystem, numCurrentOg, numTargetAbv, numYeastTol, activePpg, defaultDryFg])

  return (
    <Stack gap="xl">
      {/* Editorial Header */}
      <Box>
        <Text
          size="xs"
          fw={800}
          c="dimmed"
          style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          Chaptalization & ABV Targeter
        </Text>
        <Title order={1} size="h2" fw={800} style={{ letterSpacing: '-0.03em' }}>
          Boost Sugar & Reach Target ABV
        </Title>
        <Text c="dimmed" mt={4} style={{ maxWidth: 640 }}>
          Determine the exact weight of sugar, honey, or syrup needed to hit your target alcohol by volume.
        </Text>
      </Box>

      <Grid gap="xl" align="stretch">
        {/* Left Column: Form Inputs */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder padding="lg" radius="xs" style={{ height: '100%' }}>
            <Stack gap="md">
              <Text fw={700} size="sm" style={{ letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Batch & Goals
              </Text>

              <NumberInput
                label={`Batch Volume (${unitSystem === 'us' ? 'Gallons' : 'Liters'})`}
                description="Target final liquid volume"
                value={batchSize}
                onChange={setBatchSize}
                min={0.1}
                step={unitSystem === 'us' ? 0.5 : 1}
                decimalScale={1}
                size="md"
              />

              <NumberInput
                label="Current Starting Gravity (OG)"
                description="Must or juice before adding extra sugar"
                value={currentOg}
                onChange={setCurrentOg}
                min={1.000}
                max={1.250}
                step={0.002}
                decimalScale={3}
                fixedDecimalScale
                size="md"
              />

              <NumberInput
                label="Desired Target ABV (%)"
                description="Alcohol strength you want to achieve"
                value={targetAbv}
                onChange={setTargetAbv}
                min={1}
                max={25}
                step={0.5}
                decimalScale={1}
                size="md"
              />

              <NumberInput
                label="Yeast Alcohol Tolerance (% ABV)"
                description="Ceiling for your chosen yeast strain"
                value={yeastTolerance}
                onChange={setYeastTolerance}
                min={1}
                max={25}
                step={0.5}
                decimalScale={1}
                size="md"
              />
            </Stack>
          </Card>
        </Grid.Col>

        {/* Right Column: Hero Typographic Outcomes */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="md" style={{ height: '100%' }}>
            <Card withBorder padding="xl" radius="xs" style={{ flex: 1 }}>
              <Stack gap="lg">
                <Group justify="space-between" align="center">
                  <Text fw={700} size="xs" c="dimmed" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Required Sugar Addition
                  </Text>
                  <Badge
                    size="lg"
                    radius="xs"
                    variant={result.exceedsTolerance ? 'filled' : 'light'}
                    color={result.exceedsTolerance ? 'orange' : 'dark'}
                  >
                    {result.exceedsTolerance ? 'Exceeds Tolerance' : 'Within Limits'}
                  </Badge>
                </Group>

                <Divider />

                {/* Fermentable Source Selector */}
                <Stack gap="xs">
                  <Select
                    label="Fermentable Source"
                    description="Sugars have varying gravity points per pound (PPG)"
                    value={selectedFermentableId}
                    onChange={(val) => val && setSelectedFermentableId(val)}
                    data={FERMENTABLES.map((f) => ({
                      value: f.id,
                      label: `${f.name} (${f.ppg} PPG)`,
                    }))}
                    size="md"
                  />

                  {selectedFermentableId === 'custom' && (
                    <NumberInput
                      label="Custom PPG (Points per Gallon)"
                      description="Specific gravity points contributed by 1 lb in 1 gal"
                      value={customPpg}
                      onChange={setCustomPpg}
                      min={1}
                      max={60}
                      step={1}
                      size="sm"
                    />
                  )}
                </Stack>

                {/* Primary Weight Readout */}
                <Box>
                  <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Addition Amount ({selectedFermentable.name})
                  </Text>
                  {unitSystem === 'us' ? (
                    <Group align="baseline" gap="xs" mt={4}>
                      <Text
                        fw={800}
                        style={{
                          fontSize: '3.25rem',
                          lineHeight: 1.1,
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {result.displayLbs > 0 && `${result.displayLbs} lb `}
                        {result.displayOz.toFixed(1)} oz
                      </Text>
                      <Text size="sm" c="dimmed">
                        ({result.weightLbs.toFixed(2)} lbs total)
                      </Text>
                    </Group>
                  ) : (
                    <Group align="baseline" gap="xs" mt={4}>
                      <Text
                        fw={800}
                        style={{
                          fontSize: '3.25rem',
                          lineHeight: 1.1,
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {result.weightKg >= 1
                          ? `${result.weightKg.toFixed(2)} kg`
                          : `${Math.round(result.weightGrams)} g`}
                      </Text>
                      {result.weightKg >= 1 && (
                        <Text size="sm" c="dimmed">
                          ({Math.round(result.weightGrams)} g)
                        </Text>
                      )}
                    </Group>
                  )}
                </Box>

                {/* Secondary Metrics: Target OG & Gravity Points Deficit */}
                <Grid gap="lg" pt="xs">
                  <Grid.Col span={6}>
                    <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Target Initial Gravity
                    </Text>
                    <Text
                      fw={800}
                      size="xl"
                      style={{
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {result.targetOg.toFixed(3)}
                    </Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      Need +{result.gravityPointsDeficit.toFixed(1)} gravity points
                    </Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Fermentable Efficiency
                    </Text>
                    <Text
                      fw={800}
                      size="xl"
                      style={{
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {activePpg} PPG
                    </Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      Total points: {Math.round(result.totalPoints)}
                    </Text>
                  </Grid.Col>
                </Grid>

                {/* Feasibility Warning or Success Banner */}
                {result.exceedsTolerance ? (
                  <Alert
                    variant="light"
                    color="orange"
                    title="Target Exceeds Yeast Alcohol Tolerance"
                    icon={<AlertTriangle size={18} />}
                    radius="xs"
                  >
                    Your target ABV ({numTargetAbv}%) is higher than the yeast's rated alcohol tolerance ({numYeastTol}%). Adding this amount of sugar will cause fermentation to stall before reaching your target ABV, resulting in a sweet dessert-level residual finish. Consider a high-gravity yeast strain (e.g. Lalvin EC-1118 or K1-V1116) rated for 18%+.
                  </Alert>
                ) : (
                  <Card withBorder p="sm" radius="xs">
                    <Group gap="xs" align="center">
                      <CheckCircle2 size={16} />
                      <Text size="xs" fw={500}>
                        Target ABV is within yeast tolerance. Yeast should ferment dry to ~{defaultDryFg.toFixed(3)}.
                      </Text>
                    </Group>
                  </Card>
                )}
              </Stack>
            </Card>

            {/* Disclaimer Footnote Card */}
            <Card withBorder p="md" radius="xs">
              <Group gap="xs" align="flex-start" wrap="nowrap">
                <Scale size={16} style={{ marginTop: 3, flexShrink: 0 }} />
                <Text size="xs" c="dimmed">
                  * <strong>Ballpark calculation note:</strong> Calculations assume your entered batch size is the final volume. Dissolving dry sugars and liquid syrups adds physical liquid volume (e.g., 1 lb sugar adds ~0.075 gal / 1 lb honey adds ~0.084 gal), which slightly dilutes gravity points if not planned for.
                </Text>
              </Group>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
