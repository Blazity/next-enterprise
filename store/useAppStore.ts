 "use client";

import { create } from "zustand";

type AppState = {
  initialized: boolean;
};

type AppActions = {
  setInitialized: (value: boolean) => void;
};

type Store = AppState & AppActions;

export const useAppStore = create<Store>((set) => ({
  initialized: false,
  setInitialized: (value) => set({ initialized: value }),
}));

