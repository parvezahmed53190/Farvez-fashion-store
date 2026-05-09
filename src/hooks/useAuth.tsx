import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_photo?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user_info');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Failed to parse user_info from localStorage', e);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Starting checkAuth');
    
    // Safety timeout: If auth check takes more than 10 seconds, force loading to false
    const safetyTimeout = setTimeout(() => {
      console.warn('AuthProvider: checkAuth timed out. Forcing loading to false.');
      setLoading(false);
    }, 10000);

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setUser(null);
        localStorage.removeItem('user_info');
        clearTimeout(safetyTimeout);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem('user_info', JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            profile_photo: data.profile_photo
          }));
        } else {
          setUser(null);
          localStorage.removeItem('user_info');
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth check failed', err);
        setUser(null);
      } finally {
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    };
    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user_info', JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      profile_photo: userData.profile_photo
    }));
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
    } catch (e) {
      console.error('Logout request failed', e);
    }
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      localStorage.setItem('user_info', JSON.stringify({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        profile_photo: updated.profile_photo
      }));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
