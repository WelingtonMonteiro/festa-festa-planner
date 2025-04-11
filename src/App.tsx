
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
import Mensagens from '@/pages/Mensagens';
import Estatisticas from '@/pages/Estatisticas';
import Configuracoes from '@/pages/Configuracoes';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Notificacoes from '@/pages/Notificacoes';
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
        <Route path="/mensagens" element={<MainLayout><Mensagens /></MainLayout>} />
        <Route path="/estatisticas" element={<MainLayout><Estatisticas /></MainLayout>} />
        <Route path="/configuracoes" element={<MainLayout><Configuracoes /></MainLayout>} />
        <Route path="/notificacoes" element={<MainLayout><Notificacoes /></MainLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
