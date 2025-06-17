import React, { useEffect } from 'react';
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
  const { connect } = useWebSocket();

  useEffect(() => {
    console.log('App mounted, attempting to connect...');
    // Auto-connect on mount - only once
    connect();
  }, []); // Empty dependency array to run only once

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