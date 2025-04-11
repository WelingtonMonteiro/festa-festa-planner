
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import ClientDetails from '@/pages/ClientDetails';
import CalendarPage from '@/pages/CalendarPage';
import Events from '@/pages/Events';
import KitsThemes from '@/pages/KitsThemes';
import Financial from '@/pages/Financial';
import Messages from '@/pages/Messages';
import Statistics from '@/pages/Statistics';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Notifications from '@/pages/Notifications';
import Lead from '@/pages/Lead';
import Landing from '@/pages/Landing';
import { ThemeProvider } from '@/hooks/use-theme';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/app" element={<MainLayout><Index /></MainLayout>} />
        <Route path="/clients" element={<MainLayout><Clients /></MainLayout>} />
        <Route path="/client/:id" element={<MainLayout><ClientDetails /></MainLayout>} />
        <Route path="/calendar" element={<MainLayout><CalendarPage /></MainLayout>} />
        <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
        <Route path="/kits-themes" element={<MainLayout><KitsThemes /></MainLayout>} />
        <Route path="/financial" element={<MainLayout><Financial /></MainLayout>} />
        <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
        <Route path="/statistics" element={<MainLayout><Statistics /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
        <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
        <Route path="/leads" element={<MainLayout><Lead /></MainLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
