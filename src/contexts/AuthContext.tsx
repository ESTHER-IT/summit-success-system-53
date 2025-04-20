
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

type Role = 'author' | 'reviewer' | 'admin' | null;

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database for demo purposes (in a real app, this would be a backend API)
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Author User', email: 'author@example.com', password: 'author123', role: 'author' },
  { id: 3, name: 'Reviewer User', email: 'reviewer@example.com', password: 'reviewer123', role: 'reviewer' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role as Role);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string, role: Role): Promise<boolean> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user with matching email, password, and role
    const foundUser = mockUsers.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );
    
    if (foundUser) {
      // Create a user object without the password
      const userForState = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role as Role
      };
      
      // Save to state and localStorage
      setUser(userForState);
      setRole(userForState.role);
      localStorage.setItem('user', JSON.stringify(userForState));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email, password, or role.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Register function (for authors only)
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already in use.",
        variant: "destructive"
      });
      
      return false;
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      password,
      role: 'author' as Role
    };
    
    // In a real app, this would be an API call to save the user
    mockUsers.push(newUser);
    
    toast({
      title: "Registration successful",
      description: "You can now log in with your credentials.",
    });
    
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    role,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
