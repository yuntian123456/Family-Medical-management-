import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import

interface User {
  id: number;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void; // Simplified: token contains user info or we decode it
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({ id: decodedToken.userId, email: decodedToken.email });
          setToken(storedToken);
        } else {
          // Token expired
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    setIsLoading(true);
    try {
      const decodedToken = jwtDecode<DecodedToken>(newToken);
      localStorage.setItem('token', newToken);
      setUser({ id: decodedToken.userId, email: decodedToken.email });
      setToken(newToken);
    } catch (error) {
      console.error('Failed to decode token during login:', error);
      // Handle invalid token scenario if necessary
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
