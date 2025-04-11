
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Clientes from '@/pages/Clientes';
import DetalhesCliente from '@/pages/DetalhesCliente';
import CalendarioPage from '@/pages/CalendarioPage';
import Eventos from '@/pages/Eventos';
import KitsTemas from '@/pages/KitsTemas';
import Financeiro from '@/pages/Financeiro';
import Messages from '@/pages/Messages';
import Estatisticas from '@/pages/Estatisticas';
import Reports from '@/pages/Reports';
import Configuracoes from '@/pages/Configuracoes';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Notifications from '@/pages/Notifications';
import Lead from '@/pages/Lead';
import Landing from '@/pages/Landing';
import GerenciamentoClientes from '@/pages/GerenciamentoClientes';
import { ThemeProvider } from '@/hooks/use-theme';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/app" element={<MainLayout><Index /></MainLayout>} />
        <Route path="/clients" element={<MainLayout><Clientes /></MainLayout>} />
        <Route path="/client/:id" element={<MainLayout><DetalhesCliente /></MainLayout>} />
        <Route path="/client-management" element={<MainLayout><GerenciamentoClientes /></MainLayout>} />
        <Route path="/calendar" element={<MainLayout><CalendarioPage /></MainLayout>} />
        <Route path="/events" element={<MainLayout><Eventos /></MainLayout>} />
        <Route path="/kits-themes" element={<MainLayout><KitsTemas /></MainLayout>} />
        <Route path="/financial" element={<MainLayout><Financeiro /></MainLayout>} />
        <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
        <Route path="/statistics" element={<MainLayout><Estatisticas /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><Configuracoes /></MainLayout>} />
        <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
        <Route path="/leads" element={<MainLayout><Lead /></MainLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
