import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CategoryState {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      selectedCategory: '산책',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: 'walk-category',
    }
  )
);
