import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  loggedIn: boolean;
  authToken: string;
  login: (email: string, password: string) => Promise<{'success': boolean, 'error': string}>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState('');

  const checkAuthStatus = async () => {
    const accessToken = localStorage.getItem('auth-token');
    setAuthToken(accessToken || '');
    setLoggedIn(!!accessToken);
  };

  const login = async(email: string, password: string): Promise<{'success': boolean, 'error': string}> => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const API_PATH = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${API_PATH}/login`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {'success': false, 'error': errorData.error};
      }

      const data = await res.json();

      localStorage.setItem('auth-token', data.access_token);
      setAuthToken(data.access_token);
      setLoggedIn(true);
      return {'success': true, 'error': ''};
    } catch (error) {
      return {'success': false, 'error': 'Ocorreu um erro ao realizar login'};
    }
  }

  const logout = async() => {
    localStorage.removeItem('auth-token');
    setAuthToken('');
    setLoggedIn(false);
  }

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = { loggedIn, authToken, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
