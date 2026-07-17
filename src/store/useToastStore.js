import { create } from "zustand";

export const useToast = create((set) => ({
    isOpen: false,
    message: '',
    color: 'green',
    toastType: 'warning',
    showToast: (message, toastType = "info", color) => {
        set({ isOpen: true, message, color, toastType })

        setTimeout(() => {
            set({ isOpen: false })
        }, [3000])
    },
    hideToast: () => set({ isOpen: false })
}))