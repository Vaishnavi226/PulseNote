import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, RegisterPayload, LoginPayload } from './types';
import { authService } from './authService';
import { authEvents } from './authEvents';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    authService.removeToken();
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = authService.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await authService.getMe();
        setUser({
          id: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email,
          role: profile.role,
        });
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [clearAuth]);

  useEffect(() => {
    const unsubscribe = authEvents.onInvalid(clearAuth);
    return unsubscribe;
  }, [clearAuth]);

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await authService.login(payload);
    authService.setToken(result.token);
    setUser(result.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await authService.register(payload);
    authService.setToken(result.token);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
