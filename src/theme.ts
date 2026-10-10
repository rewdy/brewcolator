import { createTheme } from '@mantine/core'

export const theme = createTheme({
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  headings: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '700',
  },
  fontSizes: {
    xs: '0.8125rem', // 13px
    sm: '0.9375rem', // 15px
    md: '1.125rem',  // 18px (Base)
    lg: '1.3125rem', // 21px
    xl: '1.625rem',  // 26px
  },
  defaultRadius: 'xs',
  cursorType: 'pointer',
})
