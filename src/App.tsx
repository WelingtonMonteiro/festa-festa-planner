
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CalendarioPage from "./pages/CalendarioPage";
import KitsTemas from "./pages/KitsTemas";
import Estatisticas from "./pages/Estatisticas";
import NotFound from "./pages/NotFound";
import { FestaProvider } from "./contexts/FestaContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FestaProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/calendario" element={<MainLayout><CalendarioPage /></MainLayout>} />
            <Route path="/kits-temas" element={<MainLayout><KitsTemas /></MainLayout>} />
            <Route path="/estatisticas" element={<MainLayout><Estatisticas /></MainLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </FestaProvider>
  </QueryClientProvider>
);

export default App;
