
import { createRoot } from 'react-dom/client'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Inicializar o cliente do Supabase antes do render para garantir que
// ele esteja disponível em toda a aplicação
import { supabase } from './integrations/supabase/client';

// Log para confirmar conexão
supabase.auth.getSession().then(({ data }) => {
  console.log('Supabase inicializado:', data.session ? 'Autenticado' : 'Não autenticado');
}).catch(error => {
  console.error('Erro ao inicializar Supabase:', error);
});

// Utiliza o BrowserRouter como é o que está sendo usado na aplicação atualmente
// Poderia migrar para o createBrowserRouter no futuro para ativar os flags da v7
createRoot(document.getElementById("root")!).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </BrowserRouter>
);
