import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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