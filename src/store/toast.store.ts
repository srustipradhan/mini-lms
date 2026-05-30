import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
  show: (message: string, type?: ToastType) => void;
  dismiss: (id: string) => void;
}

let toastCounter = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  show: (message, type = 'info') => {
    const id = `toast-${toastCounter += 1}`;
    set({ toasts: [...get().toasts, { id, message, type }] });

    setTimeout(() => {
      get().dismiss(id);
    }, 3_500);
  },

  dismiss: (id) => {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) });
  },
}));
