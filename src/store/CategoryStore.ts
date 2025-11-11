import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CategoryState {
  selectedCategory: '산책' | '동행 산책' | '유기견 산책' | '플로깅';
  setSelectedCategory: (category: '산책' | '동행 산책' | '유기견 산책' | '플로깅') => void;
}

export const CategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      selectedCategory: '산책',
      setSelectedCategory: (category: '산책' | '동행 산책' | '유기견 산책' | '플로깅') => set({ selectedCategory: category }),
    }),
    {
      name: 'walk-category',
    }
  )
);
