import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalkState {
  walkState: 'walk' | 'stop';
  setWalkState: (walkState: 'walk' | 'stop') => void;
}

export const WalkStateStore = create<WalkState>()(
  persist(
    (set) => ({
      walkState: 'stop',
      setWalkState: (walkState: 'walk' | 'stop') => set({ walkState }),
    }),
    {
      name: 'walk-state',
    }
  )
);
