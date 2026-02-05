import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from '@/common/contexts/ThemeProvider';
import { Toaster } from '@/common/components/shadcn/sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster position="bottom-right" />
    </ThemeProvider>
  </StrictMode>,
);
