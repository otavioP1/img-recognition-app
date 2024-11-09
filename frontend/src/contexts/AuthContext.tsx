import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  loggedIn: boolean;
  login: () => void;
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

  const checkAuthStatus = async () => {
    // pegar jwt do localStorage
  };

  const login = async() => {
    setLoggedIn(true);
  }

  const logout = async() => {
    setLoggedIn(false);
  }

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = { loggedIn, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
