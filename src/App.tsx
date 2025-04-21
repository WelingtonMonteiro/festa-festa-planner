
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
import { StorageProvider } from './contexts/storageContext';
import { FestaProvider } from './contexts/handleContext';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';

function App() {
  return (
    <ApiProvider>
      <StorageProvider>
        <AuthProvider>
          <FestaProvider>
            <Toaster position="top-right" richColors />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rotas protegidas com layout principal */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/clientes" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Clients />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/clientes/:id" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ClientDetails />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/clientes/gerenciamento" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ClientsManagement />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/eventos" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Eventos />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/mensagens" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Messages />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/estatisticas" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Statistics />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/kits-temas" element={
                <ProtectedRoute>
                  <MainLayout>
                    <KitsThems />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/financeiro" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Financial />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/calendario" element={
                <ProtectedRoute>
                  <MainLayout>
                    <CalendarPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/notificacoes" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Notifications />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/leads" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Leads />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/relatorios" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/configuracoes" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Configurations />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/contratos" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Contracts />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin-settings" element={
                <ProtectedRoute>
                  <MainLayout>
                    <AdminSettings />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/planos" element={
                <ProtectedRoute>
                  <MainLayout>
                    <PlansManagement />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </FestaProvider>
        </AuthProvider>
      </StorageProvider>
    </ApiProvider>
  );
}

export default App;
