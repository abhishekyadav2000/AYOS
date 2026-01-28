import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'MAIN_SCREEN' | 'AYOS_DESKTOP';

interface AYOSGlobalState {
  // Navigation
  appMode: AppMode;
  enterAYOS: () => void;
  exitAYOS: () => void;
  
  // Theme
  theme: 'green' | 'blue' | 'purple' | 'orange';
  setTheme: (theme: 'green' | 'blue' | 'purple' | 'orange') => void;
  
  // Game scores
  scores: Record<string, number>;
  setScore: (game: string, score: number) => void;
}

export const useAYOSGlobal = create<AYOSGlobalState>()(
  persist(
    (set) => ({
      appMode: 'MAIN_SCREEN',
      enterAYOS: () => set({ appMode: 'AYOS_DESKTOP' }),
      exitAYOS: () => set({ appMode: 'MAIN_SCREEN' }),
      
      theme: 'green',
      setTheme: (theme) => set({ theme }),
      
      scores: {},
      setScore: (game, score) => 
        set((state) => ({
          scores: {
            ...state.scores,
            [game]: Math.max(state.scores[game] || 0, score),
          },
        })),
    }),
    {
      name: 'ayos_global_v1',
      partialize: (state) => ({
        theme: state.theme,
        scores: state.scores,
      }),
    }
  )
);
