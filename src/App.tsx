
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import MainLayout from './components/layout/MainLayout';
import Eventos from './pages/Eventos';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Messages from './pages/Messages';
import Statistics from './pages/Statistics';
import KitsThems from './pages/KitsThems';
import Financial from './pages/Financial';
import CalendarPage from './pages/CalendarPage';
import Notifications from './pages/Notifications';
import './App.css';
import Leads from './pages/Leads';
import ClientsManagement from './pages/ClientsManagement';
import Reports from './pages/Reports';
import Configurations from './pages/Configurations';
import AdminSettings from './pages/AdminSettings';
import Contracts from './pages/Contracts';
import PlansManagement from './pages/admin/PlansManagement';
import { Toaster } from './components/ui/sonner';
import { ApiProvider } from './contexts/apiContext';
import { AuthProvider } from './contexts/authContext';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="clientes">
                    <Route index element={<Clients />} />
                    <Route path=":id" element={<ClientDetails />} />
                    <Route path="gerenciamento" element={<ClientsManagement />} />
                  </Route>
                  <Route path="eventos" element={<Eventos />} />
                  <Route path="mensagens" element={<Messages />} />
                  <Route path="estatisticas" element={<Statistics />} />
                  <Route path="kits-temas" element={<KitsThems />} />
                  <Route path="financeiro" element={<Financial />} />
                  <Route path="calendario" element={<CalendarPage />} />
                  <Route path="notificacoes" element={<Notifications />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="relatorios" element={<Reports />} />
                  <Route path="configuracoes" element={<Configurations />} />
                  <Route path="contratos" element={<Contracts />} />
                  <Route path="admin-settings" element={<AdminSettings />} />
                  <Route path="planos" element={<PlansManagement />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
