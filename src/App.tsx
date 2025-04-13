
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Toaster } from '@/components/ui/toaster';
import { ApiProvider } from './contexts/apiContext';
import { HandleProvider } from './contexts/HandleProvider';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="festa-theme">
      <ApiProvider>
        <HandleProvider>
          <Router>
            <AppRoutes />
            <Toaster />
          </Router>
        </HandleProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
