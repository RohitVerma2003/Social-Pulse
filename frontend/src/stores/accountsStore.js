import { create } from 'zustand';
import api from '../utils/api';

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

const useAccountsStore = create(
  persist(
    (set) => ({
      connectedAccounts: {
        twitter: null,
        linkedin: null,
        instagram: null,
      },
      isLoading: false,
      error: null,
      
      // Fetch all connected accounts
      fetchAccounts: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/accounts');
          set({
            connectedAccounts: response.data.accounts || response.data,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to fetch accounts',
            isLoading: false,
          });
        }
      },
      
      // Connect an account via API
      connectAccountAPI: async (platform, username, accessToken, refreshToken, followers, profileUrl) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/accounts/connect', {
            platform,
            username,
            accessToken,
            refreshToken,
            followers,
            profileUrl,
          });
          if (response.data.success) {
            set((state) => ({
              connectedAccounts: {
                ...state.connectedAccounts,
                [platform]: {
                  id: response.data.account.id,
                  username: response.data.account.username,
                  followers: response.data.account.followers,
                  connectedAt: response.data.account.connectedAt,
                  profileUrl: response.data.account.profileUrl,
                },
              },
              isLoading: false,
            }));
            return response.data;
          }
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Failed to connect account';
          set({
            error: errorMsg,
            isLoading: false,
          });
          throw err;
        }
      },
      
      // Disconnect an account via API
      disconnectAccountAPI: async (platform) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.delete(`/accounts/${platform}`);
          if (response.data.success) {
            set((state) => ({
              connectedAccounts: {
                ...state.connectedAccounts,
                [platform]: null,
              },
              isLoading: false,
            }));
            return response.data;
          }
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Failed to disconnect account';
          set({
            error: errorMsg,
            isLoading: false,
          });
          throw err;
        }
      },
      
      // Local state updates
      connectAccount: (platform, accountData) => set((state) => ({
        connectedAccounts: {
          ...state.connectedAccounts,
          [platform]: accountData,
        },
      })),
      
      disconnectAccount: (platform) => set((state) => ({
        connectedAccounts: {
          ...state.connectedAccounts,
          [platform]: null,
        },
      })),
      
      updateAccount: (platform, accountData) => set((state) => ({
        connectedAccounts: {
          ...state.connectedAccounts,
          [platform]: { ...state.connectedAccounts[platform], ...accountData },
        },
      })),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'accounts-storage',
    }
  )
);

export default useAccountsStore;