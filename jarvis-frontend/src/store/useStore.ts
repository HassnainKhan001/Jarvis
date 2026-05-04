import { create } from 'zustand';
import type { User, AIProvider, SystemStatus } from '../types/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

interface JarvisState {
  // Chat state
  messages: Message[];
  isLoading: boolean;
  isThinking: boolean;
  
  // Audio state
  isPlaying: boolean;
  isListening: boolean;
  
  // User state
  users: User[];
  currentUser: User | null;
  
  // Provider state
  providers: AIProvider[];
  currentProvider: string;
  
  // System state
  systemStatus: SystemStatus | null;
  isHealthy: boolean;
  
  // Settings
  settingsOpen: boolean;
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setThinking: (thinking: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setListening: (listening: boolean) => void;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;
  setProviders: (providers: AIProvider[]) => void;
  setCurrentProvider: (provider: string) => void;
  setSystemStatus: (status: SystemStatus | null) => void;
  setHealthy: (healthy: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useStore = create<JarvisState>((set) => ({
  // Initial state
  messages: [],
  isLoading: false,
  isThinking: false,
  isPlaying: false,
  isListening: false,
  users: [],
  currentUser: null,
  providers: [],
  currentProvider: 'local',
  systemStatus: null,
  isHealthy: false,
  settingsOpen: false,
  
  // Actions
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }]
  })),
  
  clearMessages: () => set({ messages: [] }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setThinking: (thinking) => set({ isThinking: thinking }),
  
  setPlaying: (playing) => set({ isPlaying: playing }),
  
  setListening: (listening) => set({ isListening: listening }),
  
  setUsers: (users) => set({ users }),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setProviders: (providers) => set({ providers }),
  
  setCurrentProvider: (provider) => set({ currentProvider: provider }),
  
  setSystemStatus: (status) => set({ systemStatus: status }),
  
  setHealthy: (healthy) => set({ isHealthy: healthy }),
  
  setSettingsOpen: (open) => set({ settingsOpen: open }),
}));
