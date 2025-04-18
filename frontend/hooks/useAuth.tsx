import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAuthState: (isAuthenticated: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: User | any) => set({ user }),
      setAuthState: (isAuthenticated: boolean) => set({ isAuthenticated }),
    }),
    {
      name: "auth-storage", // Persist the state
    }
  )
);

export const useAuth = () => useAuthStore();