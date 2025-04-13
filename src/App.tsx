
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Toaster } from 'sonner';
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
            <Toaster position="top-right" />
          </Router>
        </HandleProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
