import {
  ActionIcon,
  Box,
  Container,
  Divider,
  Group,
  SegmentedControl,
  Stack,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core'
import { useAtom } from 'jotai'
import { Moon, Sparkles, Sun, Wine, Zap } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import type { UnitSystem } from '../lib/brewing-math.ts'
import { unitSystemAtom } from '../state/atoms.ts'

export function Header() {
  const [location] = useLocation()
  const [unitSystem, setUnitSystem] = useAtom(unitSystemAtom)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const isPredictActive = location === '/' || location === '/predict'
  const isBoostActive = location === '/boost'

  return (
    <Box component="header" pt="xl" pb="xs" mb="xl">
      <Container size="md">
        <Stack gap="lg">
          {/* Row 1: Centered Page Title */}
          <Box style={{ textAlign: 'center' }}>
            <Group justify="center" align="center" gap="xs">
              <Wine
                size={26}
                strokeWidth={2.25}
                color={colorScheme === 'dark' ? '#c04b6c' : '#721b36'}
              />
              <Text
                fw={900}
                size="xl"
                style={{
                  fontSize: '1.75rem',
                  letterSpacing: '-0.04em',
                  lineHeight: 1.1,
                }}
              >
                BREWCOLATOR
              </Text>
            </Group>
            <Text size="xs" c="dimmed" fw={500} mt={6} style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Cider, Mead & Wine Fermentation Engine
            </Text>
          </Box>

          {/* Horizontal line above the tabs */}
          <Divider />

          {/* Row 2: Centered Forecast / Boost Tabs */}
          <Group justify="center" gap="md">
            <Link href="/predict" asChild>
              <UnstyledButton
                px="lg"
                py="xs"
                style={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  letterSpacing: '-0.02em',
                  borderBottom: isPredictActive
                    ? '2.5px solid var(--mantine-color-text)'
                    : '2.5px solid transparent',
                  color: isPredictActive
                    ? 'var(--mantine-color-text)'
                    : 'var(--mantine-color-dimmed)',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                }}
              >
                <Group gap={8} align="center">
                  <Sparkles size={18} />
                  <span>Forecast</span>
                </Group>
              </UnstyledButton>
            </Link>

            <Link href="/boost" asChild>
              <UnstyledButton
                px="lg"
                py="xs"
                style={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  letterSpacing: '-0.02em',
                  borderBottom: isBoostActive
                    ? '2.5px solid var(--mantine-color-text)'
                    : '2.5px solid transparent',
                  color: isBoostActive
                    ? 'var(--mantine-color-text)'
                    : 'var(--mantine-color-dimmed)',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                }}
              >
                <Group gap={8} align="center">
                  <Zap size={18} />
                  <span>Boost ABV</span>
                </Group>
              </UnstyledButton>
            </Link>
          </Group>

          {/* Row 3: Unit Chooser & Light/Dark Mode (Right Aligned) */}
          <Group justify="flex-end" gap="sm" align="center">
            <SegmentedControl
              size="xs"
              value={unitSystem}
              onChange={(value) => setUnitSystem(value as UnitSystem)}
              data={[
                { label: 'US (Gal)', value: 'us' },
                { label: 'Metric (L)', value: 'metric' },
              ]}
              styles={{
                root: {
                  fontWeight: 600,
                },
              }}
            />

            <ActionIcon
              variant="default"
              size="md"
              onClick={() => toggleColorScheme()}
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </ActionIcon>
          </Group>
        </Stack>
      </Container>
    </Box>
  )
}
