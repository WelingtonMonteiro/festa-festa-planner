
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
