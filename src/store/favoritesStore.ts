import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Fund } from '@/src/types/fund';

interface FavoritesState {
  favorites: Fund[];
  addFavorite: (fund: Fund) => void;
  removeFavorite: (schemeCode: number) => void;
  isFavorite: (schemeCode: number) => boolean;
  toggleFavorite: (fund: Fund) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    immer((set, get) => ({
      favorites: [],

      addFavorite: (fund: Fund) => {
        set((state) => {
          const exists = state.favorites.some((f) => f.schemeCode === fund.schemeCode);
          if (!exists) {
            state.favorites.push(fund);
          }
        });
      },

      removeFavorite: (schemeCode: number) => {
        set((state) => {
          state.favorites = state.favorites.filter((f) => f.schemeCode !== schemeCode);
        });
      },

      isFavorite: (schemeCode: number) => {
        return get().favorites.some((f) => f.schemeCode === schemeCode);
      },

      toggleFavorite: (fund: Fund) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(fund.schemeCode)) {
          removeFavorite(fund.schemeCode);
        } else {
          addFavorite(fund);
        }
      },
    })),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
