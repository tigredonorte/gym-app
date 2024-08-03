import { postRequest } from '@gym-app/shared/web';
import { IUser } from '@gym-app/user/web';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getTokenTimeExpiration } from './isTokenExpired';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: IUser | null;
  logout: () => void;
  login: (data: { email: string, password: string }) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [authState, setAuthState] = useState<Pick<AuthContextType, 'isAuthenticated' | 'user'>>({ isAuthenticated: false, user: null });
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const clearAuthTimeout = useCallback((timeoutId: NodeJS.Timeout | null) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setAuthState({ isAuthenticated: false, user: null });
    clearAuthTimeout(timeoutId);
  }, [clearAuthTimeout]);


  const setNewToken = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    clearAuthTimeout(timeoutId);
    const timeToExpire = getTokenTimeExpiration(newToken);
    if (timeToExpire > 0) {
      const newTimeoutId = setTimeout(() => refreshToken(), timeToExpire - 5000);
      setTimeoutId(newTimeoutId as unknown as NodeJS.Timeout);
    }
  }, [clearAuthTimeout]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await postRequest<{ token: string }>('/auth/refreshToken', {});
      const newToken = response.token;
      setNewToken(newToken);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  }, [setNewToken, logout]);

  const login = useCallback(async (data: { email: string, password: string }) => {
    try {
      const { token, ...user } = await postRequest<{ token: string } & IUser>('/auth/login', data);
      localStorage.setItem('userData', JSON.stringify(user));
      setNewToken(token);
      setAuthState({
        isAuthenticated: true,
        user,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [setNewToken]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const timeToExpire = getTokenTimeExpiration(token);
    const isExpired = timeToExpire <= 0;
    const user = !isExpired ? JSON.parse(localStorage.getItem('userData') as string) : null;

    if (isExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }

    setAuthState({
      isAuthenticated: !isExpired,
      user,
    });

    if (timeToExpire > 0) {
      const newTimeoutId = setTimeout(() => refreshToken(), timeToExpire - 1000);
      setTimeoutId(newTimeoutId as unknown as NodeJS.Timeout);
    }
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
