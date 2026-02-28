import { create } from 'zustand';
import api from '../utils/api';
import useAccountsStore from './accountsStore';

const persist = (config, options) => (set, get, api_instance) => {
  const { name } = options;

  const storage = {
    getItem: (key) => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
    },
  };

  const storedValue = storage.getItem(name);
  if (storedValue) {
    api_instance.setState(storedValue.state);
  }

  api_instance.subscribe((state) => {
    storage.setItem(name, { state });
  });

  return config(set, get, api_instance);
};

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => set({
        user: userData,
        token,
        isAuthenticated: true
      }),

      // Synchronous logout for immediate state updates
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // also reset account store values to null
        useAccountsStore.setState({
          connectedAccounts: {
            twitter: null,
            linkedin: null,
            instagram: null,
          },
          isLoading: false,
          error: null,
        });
      },

      // Async logout that also clears server-side session
      logoutAsync: async () => {
        try {
          await api.post('/auth/logout').catch(() => {
            // Ignore errors
          });
        } catch (e) {
          // Silent fail
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
          useAccountsStore.setState({
            connectedAccounts: {
              twitter: null,
              linkedin: null,
              instagram: null,
            },
            isLoading: false,
            error: null,
          });
        }
      },

      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;