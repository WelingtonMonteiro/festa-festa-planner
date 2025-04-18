
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients.tsx';
import ClientDetails from '@/pages/ClientDetails.tsx';
import CalendarPage from '@/pages/CalendarPage.tsx';
import Eventos from '@/pages/Eventos';
import KitsThems from '@/pages/KitsThems.tsx';
import Financial from '@/pages/Financial.tsx';
import Messages from '@/pages/Messages';
import Statistics from '@/pages/Statistics.tsx';
import Reports from '@/pages/Reports';
import Configurations from '@/pages/Configurations.tsx';
import NotFound from '@/pages/NotFound';
import Notifications from '@/pages/Notifications';
import Lead from '@/pages/Leads.tsx';
import Landing from '@/pages/Landing';
import ClientsManagement from '@/pages/ClientsManagement.tsx';
import Contracts from '@/pages/Contracts';
import AdminSettings from '@/pages/AdminSettings';
import PlansManagement from '@/pages/admin/PlansManagement';
import { ThemeProvider } from '@/hooks/use-theme';
import { StorageProvider } from '@/contexts/storageContext';
import { ApiProvider } from '@/contexts/apiContext';
import { FestaProvider } from '@/contexts/handleContext';

// Criando uma instância do QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StorageProvider>
          <ApiProvider>
            <FestaProvider>
              <Toaster position="top-center" richColors />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
                <Route path="/clients" element={<MainLayout><Clients /></MainLayout>} />
                <Route path="/client/:id" element={<MainLayout><ClientDetails /></MainLayout>} />
                <Route path="/client-management" element={<MainLayout><ClientsManagement /></MainLayout>} />
                <Route path="/calendar" element={<MainLayout><CalendarPage /></MainLayout>} />
                <Route path="/events" element={<MainLayout><Eventos /></MainLayout>} />
                <Route path="/kits-themes" element={<MainLayout><KitsThems /></MainLayout>} />
                <Route path="/financial" element={<MainLayout><Financial /></MainLayout>} />
                <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
                <Route path="/statistics" element={<MainLayout><Statistics /></MainLayout>} />
                <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
                <Route path="/settings" element={<MainLayout><Configurations /></MainLayout>} />
                <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
                <Route path="/leads" element={<MainLayout><Lead /></MainLayout>} />
                <Route path="/contracts" element={<MainLayout><Contracts /></MainLayout>} />
                <Route path="/admin/settings" element={<MainLayout><AdminSettings /></MainLayout>} />
                <Route path="/admin/plans" element={<MainLayout><PlansManagement /></MainLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </FestaProvider>
          </ApiProvider>
        </StorageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
