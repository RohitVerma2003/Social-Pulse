import { create } from 'zustand';

const persist = (config, options) => (set, get, api) => {
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
    api.setState(storedValue.state);
  }

  api.subscribe((state) => {
    storage.setItem(name, { state });
  });

  return config(set, get, api);
};

const useAccountsStore = create(
  persist(
    (set) => ({
      connectedAccounts: {
        twitter: null,
        linkedin: null,
        instagram: null,
      },
      
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
    }),
    {
      name: 'accounts-storage',
    }
  )
);

export default useAccountsStore;