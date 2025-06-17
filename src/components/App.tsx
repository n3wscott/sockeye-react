import React, { useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppProvider } from '../contexts/AppContext';
import { ErrorBoundary } from './common/ErrorBoundary';
import Dashboard from './dashboard/Dashboard';
import { useWebSocket } from '../hooks/useWebSocket';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

function AppContent() {
  useWebSocket(); // Hook handles auto-connect internally

  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;