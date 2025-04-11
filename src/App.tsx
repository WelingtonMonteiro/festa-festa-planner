
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
import { ThemeProvider } from '@/hooks/use-theme';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<MainLayout><Index /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/clientes" element={<MainLayout><Clientes /></MainLayout>} />
        <Route path="/cliente/:id" element={<MainLayout><DetalhesCliente /></MainLayout>} />
        <Route path="/calendario" element={<MainLayout><CalendarioPage /></MainLayout>} />
        <Route path="/eventos" element={<MainLayout><Eventos /></MainLayout>} />
        <Route path="/kits-temas" element={<MainLayout><KitsTemas /></MainLayout>} />
        <Route path="/financeiro" element={<MainLayout><Financeiro /></MainLayout>} />
        <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
        <Route path="/estatisticas" element={<MainLayout><Estatisticas /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/configuracoes" element={<MainLayout><Configuracoes /></MainLayout>} />
        <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
        <Route path="/leads" element={<MainLayout><Lead /></MainLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
