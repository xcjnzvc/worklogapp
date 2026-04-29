import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface User {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "USER";
  companyId: string;
  companyName: string;
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isRestoring: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setIsLoading: (loading: boolean) => void;
  setIsRestoring: (value: boolean) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  isRestoring: true,

  setUser: (user) => {
    SecureStore.setItemAsync("auth_user", JSON.stringify(user));
    set({ user, isLoggedIn: true, isLoading: false });
  },

  clearUser: () => {
    SecureStore.deleteItemAsync("auth_user");
    set({ user: null, isLoggedIn: false, isLoading: false });
  },

  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setIsRestoring: (value: boolean) => set({ isRestoring: value }),
}));
