import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  facility: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('conveyx_user');
    return stored ? JSON.parse(stored) : {
      id: 'USR-8821',
      name: 'Mining Control Room Operator',
      email: 'operator@mining.conveyx.io',
      role: 'Chief Safety Engineer',
      facility: 'Iron Ore Beneficiation Plant 04'
    };
  });

  const login = async (email: string, _pass: string): Promise<boolean> => {
    // Simulated auth call
    const newUser: UserProfile = {
      id: 'USR-8821',
      name: email.split('@')[0].toUpperCase() + ' (Operator)',
      email,
      role: 'Chief Safety Engineer',
      facility: 'Iron Ore Plant 04'
    };
    setUser(newUser);
    localStorage.setItem('conveyx_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('conveyx_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
