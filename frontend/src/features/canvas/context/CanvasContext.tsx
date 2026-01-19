import { createContext, useContext, type ReactNode } from 'react';

interface CanvasContextType {
  scale: number;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

interface CanvasProviderProps {
  scale: number;
  children: ReactNode;
}

export function CanvasProvider({ scale, children }: CanvasProviderProps) {
  return (
    <CanvasContext.Provider value={{ scale }}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvasScale() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasScale must be used within a CanvasProvider');
  }
  return context.scale;
}
