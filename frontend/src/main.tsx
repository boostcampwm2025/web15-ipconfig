import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { ThemeProvider } from '@/common/contexts/ThemeProvider';
import { Toaster } from '@/common/components/shadcn/sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
