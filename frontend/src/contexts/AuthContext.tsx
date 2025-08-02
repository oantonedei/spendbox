import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  subscription: {
    plan: string;
    transactionLimit: number;
    usedTransactions: number;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock users for testing
  const mockUsers = [
    {
      id: '1',
      email: 'demo@spendbox.com',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      role: 'user',
      subscription: {
        plan: 'Free',
        transactionLimit: 50,
        usedTransactions: 23
      }
    },
    {
      id: '2',
      email: 'premium@spendbox.com',
      password: 'premium123',
      firstName: 'Premium',
      lastName: 'User',
      role: 'user',
      subscription: {
        plan: 'Premium',
        transactionLimit: 999999,
        usedTransactions: 156
      }
    }
  ];

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data
      api.get('/auth/me')
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Mock login - check against mock users
      const mockUser = mockUsers.find(user => 
        user.email === email && user.password === password
      );
      
      if (mockUser) {
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = mockUser;
        const token = `mock-token-${mockUser.id}`;
        
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userWithoutPassword);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      // Mock registration - check if email already exists
      const existingUser = mockUsers.find(user => user.email === userData.email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new mock user
      const newUser = {
        id: String(mockUsers.length + 1),
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user',
        subscription: {
          plan: 'Free',
          transactionLimit: 50,
          usedTransactions: 0
        }
      };
      
      // Add to mock users (in real app, this would be saved to database)
      mockUsers.push(newUser);
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = newUser;
      const token = `mock-token-${newUser.id}`;
      
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userWithoutPassword);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 