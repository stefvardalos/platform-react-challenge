import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './api/client.ts'
import AppRoutes from './routes/AppRoutes.tsx'

const theme = createTheme({
  typography: { fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' },
  shape: { borderRadius: 16 },
  colorSchemes: {
    dark: true
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#de1b76'
    }
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#de1b76'
        }
      }
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)