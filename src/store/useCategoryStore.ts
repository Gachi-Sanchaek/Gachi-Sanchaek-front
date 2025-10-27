import { create } from 'zustand';

interface CategoryState {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: '산책',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
