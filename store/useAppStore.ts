 "use client";

import { create } from "zustand";

type AppState = {
  initialized: boolean;
  isSidebarCollapsed: boolean;
  isFullPagePlayerOpen: boolean;
};

type AppActions = {
  setInitialized: (value: boolean) => void;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
  setFullPagePlayerOpen: (value: boolean) => void;
};

type Store = AppState & AppActions;

export const useAppStore = create<Store>((set) => ({
  initialized: false,
  isSidebarCollapsed: false,
  isFullPagePlayerOpen: false,
  setInitialized: (value) => set({ initialized: value }),
  setSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setFullPagePlayerOpen: (value) => set({ isFullPagePlayerOpen: value }),
}));

