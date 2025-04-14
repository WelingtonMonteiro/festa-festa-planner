import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { FestaProvider } from "./contexts/handleContext";
import { StorageProvider } from "./contexts/storageContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Events from "./pages/Events";
import Kits from "./pages/Kits";
import Themes from "./pages/Themes";
import Messages from "./pages/Messages";
import Contracts from "./pages/Contracts";
import ContractDetails from "./pages/ContractDetails";
import ContractTemplates from "./pages/ContractTemplates";
import ContractTemplateEditor from "./pages/ContractTemplateEditor";
import Configurations from "./pages/Configurations";

// Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
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
            <Router>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/kits" element={<Kits />} />
                      <Route path="/themes" element={<Themes />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/contracts" element={<Contracts />} />
                      <Route path="/contracts/:id" element={<ContractDetails />} />
                      <Route path="/contract-templates" element={<ContractTemplates />} />
                      <Route path="/contract-templates/:id" element={<ContractTemplateEditor />} />
                      <Route path="/configurations" element={<Configurations />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </Router>
            <Toaster position="top-right" richColors />
          </FestaProvider>
        </StorageProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
