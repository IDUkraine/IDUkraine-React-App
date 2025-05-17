import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'idukraine_admin_auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return storedAuth === 'true';
  });

  useEffect(() => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, isAdmin.toString());
  }, [isAdmin]);

  const login = async (username: string, password: string) => {
    const isValid = await authService.verifyCredentials(username, password);
    if (isValid) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
