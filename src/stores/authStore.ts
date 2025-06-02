import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isFirstLaunch: boolean | null;
  isLoading: boolean;
  error: string | null;
  
  // First launch
  checkFirstLaunch: () => Promise<void>;
  setFirstLaunchComplete: () => Promise<void>;
  
  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Initialize with demo users
const setupInitialUsers = async () => {
  const users = await AsyncStorage.getItem('users');
  if (!users) {
    const initialUsers = [
      {
        id: '1',
        email: 'admin@example.com',
        password: 'admin123', // In a real app, this would be hashed
        fullName: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user@example.com',
        password: 'password123', // In a real app, this would be hashed
        fullName: 'Demo User',
        role: 'user',
        createdAt: new Date().toISOString()
      }
    ];
    await AsyncStorage.setItem('users', JSON.stringify(initialUsers));
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isFirstLaunch: null,
  isLoading: false,
  error: null,
  
  checkFirstLaunch: async () => {
    try {
      const value = await AsyncStorage.getItem('alreadyLaunched');
      
      if (value === null) {
        // First time launching the app
        set({ isFirstLaunch: true });
        // Also initialize demo data
        await setupInitialUsers();
      } else {
        set({ isFirstLaunch: false });
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      set({ isFirstLaunch: false });
    }
  },
  
  setFirstLaunchComplete: async () => {
    try {
      await AsyncStorage.setItem('alreadyLaunched', 'true');
      set({ isFirstLaunch: false });
    } catch (error) {
      console.error('Error setting first launch complete:', error);
    }
  },
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      const usersJson = await AsyncStorage.getItem('users');
      const users = JSON.parse(usersJson || '[]');
      
      const user = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        // Omit password from stored user
        const { password, ...userWithoutPassword } = user;
        set({ user: userWithoutPassword, isLoading: false });
        await AsyncStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      } else {
        set({ error: 'Invalid email or password', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ error: 'An error occurred during login', isLoading: false });
      return false;
    }
  },
  
  signup: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Check if user already exists
      const usersJson = await AsyncStorage.getItem('users');
      const users = JSON.parse(usersJson || '[]');
      
      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        set({ error: 'Email already in use', isLoading: false });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In a real app, this would be hashed
        fullName,
        role: 'user' as const,
        createdAt: new Date().toISOString()
      };
      
      // Add to users array
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      // Log in the new user
      const { password: _, ...userWithoutPassword } = newUser;
      set({ user: userWithoutPassword, isLoading: false });
      await AsyncStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      set({ error: 'An error occurred during signup', isLoading: false });
      return false;
    }
  },
  
  logout: async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      set({ user: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  checkAuth: async () => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      if (userJson) {
        set({ user: JSON.parse(userJson) });
      }
    } catch (error) {
      console.error('Check auth error:', error);
    }
  }
}));