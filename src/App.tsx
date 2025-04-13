
import React from 'react';
import { AppRoutes } from './routes';
import { Toaster } from '@/components/ui/toaster';
import { ApiProvider } from './contexts/apiContext';
import { HandleProvider } from './contexts/HandleProvider';
import { ThemeProvider } from './components/theme-provider';
import { StorageProvider } from './contexts/storageContext';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="festa-theme">
      <ApiProvider>
        <StorageProvider>
          <HandleProvider>
            <AppRoutes />
            <Toaster />
          </HandleProvider>
        </StorageProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
