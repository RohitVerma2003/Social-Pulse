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

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;