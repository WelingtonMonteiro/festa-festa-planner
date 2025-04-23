
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
import Products from './pages/Products';

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
              <Route path="/clients" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Clients />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/clients/:id" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ClientDetails />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/clients/management" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ClientsManagement />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/events" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Eventos />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Messages />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/statistics" element={
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
              <Route path="/products" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Products />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/financial" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Financial />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <MainLayout>
                    <CalendarPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
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
              <Route path="/reports" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Configurations />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/contracts" element={
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
              <Route path="/plans" element={
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
