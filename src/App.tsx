
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { FestaProvider } from "./contexts/handleContext";
import { StorageProvider } from "./contexts/storageContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Messages from "./pages/Messages";
import Contracts from "./pages/Contracts";
import Configurations from "./pages/Configurations";

// Components
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { ThemeProvider } from "./components/theme-provider";
import { useTheme } from "./hooks/use-theme";

function App() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="App">
      <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
        <StorageProvider>
          <FestaProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/contracts" element={<Contracts />} />
                    <Route path="/configurations" element={<Configurations />} />
                  </Routes>
                </main>
              </div>
            </div>
            <Toaster position="top-right" richColors />
          </FestaProvider>
        </StorageProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
