import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug: Log when state actually changes
  useEffect(() => {
    console.log('[DEBUG] Auth State Updated:', { 
      isAuthenticated: !!token && !!user, 
      token: token ? 'Present' : 'Null', 
      user: user ? user.email : 'Null' 
    });
    setLoading(false);
  }, [token, user]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    // Also store userId for backward compatibility
    localStorage.setItem('userId', newUser.user_id.toString());
  };

  const logout = () => {
    console.log("Logging out...");
    
    // Clear storage synchronously
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    
    // Schedule state updates
    setToken(null);
    setUser(null);
    
    console.log("Logout processed (state will update on next render)");
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

