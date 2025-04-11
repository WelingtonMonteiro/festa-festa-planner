
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { FestaProvider } from './contexts/FestaContext'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <FestaProvider>
      <App />
    </FestaProvider>
  </BrowserRouter>
);
