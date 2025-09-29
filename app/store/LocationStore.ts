import { create } from "zustand";

type LocationState = {
  selectedLocation: any | null; // 카카오 API documents[i] 전체 객체
  setLocation: (location: any) => void;
  clearLocation: () => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  selectedLocation: null,
  setLocation: (location) => set({ selectedLocation: location }),
  clearLocation: () => set({ selectedLocation: null }),
}));