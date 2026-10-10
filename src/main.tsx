import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { theme } from './theme.ts'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorSchemeScript defaultColorScheme="auto" />
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <App />
    </MantineProvider>
  </StrictMode>,
)
