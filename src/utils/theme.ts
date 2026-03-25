import { createTheme } from '@mui/material/styles'

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1A7A8A',
      light: '#7BC8D8',
      dark: '#115762',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B6914',
      light: '#d4b896',
      dark: '#6b5010',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#F5F3EF',
    },
    text: {
      primary: '#0d1f22',
      secondary: '#4a6b70',
    },
    error: { main: '#dc2626' },
    success: { main: '#3d6b2d' },
  },
  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          padding: '10px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 24px rgba(26,122,138,0.2)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover fieldset': { borderColor: '#7BC8D8' },
            '&.Mui-focused fieldset': { borderColor: '#1A7A8A' },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: '9999px', fontWeight: 600 },
      },
    },
  },
})
