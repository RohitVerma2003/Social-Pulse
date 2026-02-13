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

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData, token) => set({ user: userData, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;