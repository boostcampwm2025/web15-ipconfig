import { create } from 'zustand';

interface TechStackModalState {
  activeWidgetId: string | null;
  openModal: (widgetId: string) => void;
  closeModal: () => void;
}

export const useTechStackModalStore = create<TechStackModalState>((set) => ({
  activeWidgetId: null,
  openModal: (widgetId) => set({ activeWidgetId: widgetId }),
  closeModal: () => set({ activeWidgetId: null }),
}));
