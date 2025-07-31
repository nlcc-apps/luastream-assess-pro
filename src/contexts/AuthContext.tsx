import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: "Admin" | "Manager" | "Employee";
}

interface AuthContextType {
  user: User | null;
  login: (sessionId: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const navigate = useNavigate();

  const login = (sessionId: string, userData: User) => {
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // FIX: Navigate to '/app/dashboard' which is the protected area's main page
    navigate('/app/dashboard'); 
  };

  const logout = () => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = !!localStorage.getItem('sessionId');

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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