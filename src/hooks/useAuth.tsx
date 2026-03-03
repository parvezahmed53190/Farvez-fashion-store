import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/auth/me', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Auth check failed', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    await fetch('/api/auth/logout', { 
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
