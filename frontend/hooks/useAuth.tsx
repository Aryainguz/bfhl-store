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
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock users for demo
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: "2",
    name: "Test User",
    email: "user@example.com",
    password: "user123",
    role: "user" as const,
  },
];

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: async (email: string, password: string) => {
        // Simulate API request
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (!user) {
          throw new Error("Invalid email or password");
        }
        
        const { password: _, ...userWithoutPassword } = user;
        
        set({
          user: userWithoutPassword,
          isAuthenticated: true,
          isAdmin: user.role === "admin",
        });
      },
      
      register: async (name: string, email: string, password: string) => {
        // Simulate API request
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const existingUser = mockUsers.find((u) => u.email === email);
        
        if (existingUser) {
          throw new Error("User with this email already exists");
        }
        
        // In a real app, this would be handled by the backend
        // Here we're just simulating a successful registration
        
        // Don't set the user or authenticated state after registration
        // User should log in after registration
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export const useAuth = () => useAuthStore();
