
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { AuthState, User } from '@/types';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing token and user in local storage during initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setAuthState({
          user: parsedUser,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Mock login function (in a real app, this would call your backend API)
  const login = async (email: string, password: string) => {
    try {
      // In a real app, you'd make an API call here
      // For now, we're simulating success for any valid-looking email/password
      
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
      };
      
      // Mock JWT token
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      // Save to local storage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update auth state
      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
        variant: "default",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    try {
      // Validate inputs
      if (!name || !email || !password) {
        throw new Error('Please fill out all fields');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
      };
      
      // Mock JWT token
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      // Save to local storage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update auth state
      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: "Success",
        description: "Account created successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    // Remove from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update auth state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
