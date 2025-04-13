
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const ClientDetails = lazy(() => import('./pages/ClientDetails'));
const ClientsManagement = lazy(() => import('./pages/ClientsManagement'));
const KitsThems = lazy(() => import('./pages/KitsThems'));
const Eventos = lazy(() => import('./pages/Eventos'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const Messages = lazy(() => import('./pages/Messages'));
const Financial = lazy(() => import('./pages/Financial'));
const Contracts = lazy(() => import('./pages/Contracts'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Reports = lazy(() => import('./pages/Reports'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Leads = lazy(() => import('./pages/Leads'));
const Configurations = lazy(() => import('./pages/Configurations'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const Landing = lazy(() => import('./pages/Landing'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Carregando...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        
        {/* Protected routes */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/clients-management" element={<ClientsManagement />} />
          <Route path="/kits-themes" element={<KitsThems />} />
          <Route path="/events" element={<Eventos />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/configurations" element={<Configurations />} />
          <Route path="/admin" element={<AdminSettings />} />
        </Route>
        
        {/* Fallback for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
