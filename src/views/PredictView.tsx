import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  Grid,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useAtom, useAtomValue } from 'jotai'
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { predictFermentation } from '../lib/brewing-math.ts'
import { defaultDryFgAtom, unitSystemAtom } from '../state/atoms.ts'

export function PredictView() {
  const unitSystem = useAtomValue(unitSystemAtom)
  const [defaultDryFg, setDefaultDryFg] = useAtom(defaultDryFgAtom)

  // Form State
  const [batchSize, setBatchSize] = useState<number | string>(unitSystem === 'us' ? 5 : 19)
  const [og, setOg] = useState<number | string>(1.060)
  const [yeastTolerance, setYeastTolerance] = useState<number | string>(12.0)
  const [customDryFg, setCustomDryFg] = useState<number | string>(defaultDryFg)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const numOg = typeof og === 'number' ? og : parseFloat(String(og)) || 1.050
  const numTol = typeof yeastTolerance === 'number' ? yeastTolerance : parseFloat(String(yeastTolerance)) || 12.0
  const numDryFg = typeof customDryFg === 'number' ? customDryFg : parseFloat(String(customDryFg)) || defaultDryFg

  const result = useMemo(() => {
    return predictFermentation({
      og: numOg,
      yeastTolerance: numTol,
      dryFg: numDryFg,
    })
  }, [numOg, numTol, numDryFg])

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
          Outcome Forecaster
        </Text>
        <Title order={1} size="h2" fw={800} style={{ letterSpacing: '-0.03em' }}>
          Predict Final Gravity & ABV
        </Title>
        <Text c="dimmed" mt={4} style={{ maxWidth: 640 }}>
          Estimate where your cider, mead, or wine will finish based on starting gravity and yeast alcohol tolerance limits.
        </Text>
      </Box>

      <Grid gap="xl" align="stretch">
        {/* Left Column: Form Inputs */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder padding="lg" radius="xs" style={{ height: '100%' }}>
            <Stack gap="md">
              <Text fw={700} size="sm" style={{ letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Batch Parameters
              </Text>

              <NumberInput
                label={`Batch Volume (${unitSystem === 'us' ? 'Gallons' : 'Liters'})`}
                description="Total volume in fermenter"
                value={batchSize}
                onChange={setBatchSize}
                min={0.1}
                step={unitSystem === 'us' ? 0.5 : 1}
                decimalScale={1}
                size="md"
              />

              <NumberInput
                label="Starting Gravity (OG)"
                description="Initial specific gravity reading (e.g. 1.060)"
                value={og}
                onChange={setOg}
                min={1.000}
                max={1.250}
                step={0.002}
                decimalScale={3}
                fixedDecimalScale
                size="md"
              />

              <NumberInput
                label="Yeast Alcohol Tolerance (% ABV)"
                description="Manufacturer rating (e.g. EC-1118: 18%, SafCider: 11%)"
                value={yeastTolerance}
                onChange={setYeastTolerance}
                min={1}
                max={25}
                step={0.5}
                decimalScale={1}
                size="md"
              />

              {/* Advanced Baseline Dry FG */}
              <Box pt="xs">
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  rightSection={showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  px={0}
                >
                  {showAdvanced ? 'Hide Advanced Settings' : 'Advanced: Target Dry Baseline'}
                </Button>

                <Collapse expanded={showAdvanced}>
                  <Box pt="sm">
                    <NumberInput
                      label="Baseline Dry FG"
                      description="Specific gravity when all sugar is fermented (default: 0.998)"
                      value={customDryFg}
                      onChange={(val) => {
                        setCustomDryFg(val)
                        if (typeof val === 'number') setDefaultDryFg(val)
                      }}
                      min={0.980}
                      max={1.010}
                      step={0.001}
                      decimalScale={3}
                      fixedDecimalScale
                      size="sm"
                    />
                  </Box>
                </Collapse>
              </Box>
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
                    Fermentation Profile
                  </Text>
                  <Badge
                    size="lg"
                    radius="xs"
                    variant={result.isStalled ? 'filled' : 'light'}
                    color={result.isStalled ? 'orange' : 'dark'}
                  >
                    {result.profile}
                  </Badge>
                </Group>

                <Divider />

                {/* Big Typographic Readouts */}
                <Grid gap="lg">
                  <Grid.Col span={6}>
                    <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Predicted Final Gravity
                    </Text>
                    <Text
                      fw={800}
                      style={{
                        fontSize: '3rem',
                        lineHeight: 1.1,
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {result.predictedFg.toFixed(3)}
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      {result.isStalled ? 'Residual sugar remains' : 'Completely fermented dry'}
                    </Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Expected Alcohol (ABV)
                    </Text>
                    <Text
                      fw={800}
                      style={{
                        fontSize: '3rem',
                        lineHeight: 1.1,
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {result.expectedAbv.toFixed(1)}%
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      {result.isStalled ? `Capped at yeast limit (${numTol}%)` : `Potential: ${result.potentialAbv.toFixed(1)}%`}
                    </Text>
                  </Grid.Col>
                </Grid>

                {/* Stalled / Warning Banner */}
                {result.isStalled ? (
                  <Alert
                    variant="light"
                    color="orange"
                    title="Fermentation Will Stall"
                    icon={<AlertTriangle size={18} />}
                    radius="xs"
                  >
                    Potential alcohol from starting sugars ({result.potentialAbv.toFixed(1)}% ABV) exceeds your yeast tolerance ceiling ({numTol}% ABV). Fermentation is expected to halt prematurely around FG {result.predictedFg.toFixed(3)}, leaving noticeable residual sweetness.
                  </Alert>
                ) : (
                  <Paper withBorder p="sm" radius="xs">
                    <Group gap="xs" align="center">
                      <CheckCircle2 size={16} />
                      <Text size="xs" fw={500}>
                        Yeast has sufficient tolerance to ferment all available sugars completely dry.
                      </Text>
                    </Group>
                  </Paper>
                )}
              </Stack>
            </Card>

            {/* Quick Context Card */}
            <Card withBorder p="md" radius="xs">
              <Group gap="xs" align="flex-start" wrap="nowrap">
                <Info size={16} style={{ marginTop: 3, flexShrink: 0 }} />
                <Text size="xs" c="dimmed">
                  Formula uses standard specific gravity drop attenuation model: ABV = (OG - FG) &times; 131.25. Standard dry baseline is calibrated to {numDryFg.toFixed(3)}.
                </Text>
              </Group>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
