import { postRequest } from '@gym-app/shared/web';
import { IUser } from '@gym-app/user/web';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getTokenTimeExpiration } from './isTokenExpired';

interface AuthData {
  token: string
  accessId: string
  sessionId: string
}

const initialState = {
  isAuthenticated: false,
  user: null,
  sessionId: '',
  accessId: '',
};

export interface AuthContextType extends Omit<AuthData, 'token'> {
  isAuthenticated: boolean;
  user: IUser | null;
  logout: (callback?: (sessionId: string, accessId: string) => Promise<void>) => void;
  login: (data: { email: string, password: string }) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [authState, setAuthState] = useState<Omit<AuthContextType, 'logout' | 'login'>>(initialState);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const clearAuthTimeout = useCallback((timeoutId: NodeJS.Timeout | null) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, []);

  const logout = useCallback(async (callback?: (sessionId: string, accessId: string) => Promise<void>) => {
    const sessionId = localStorage.getItem('sessionId');
    const accessId = localStorage.getItem('accessId');
    try {
      await callback?.(sessionId as string, accessId as string);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('accessId');
    setAuthState(initialState);
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
      const { token, accessId, sessionId, ...user } = await postRequest<AuthData & IUser>('/auth/login', data);
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('accessId', accessId);
      localStorage.setItem('sessionId', sessionId);
      setNewToken(token);
      setAuthState({
        isAuthenticated: true,
        accessId,
        sessionId,
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
    const sessionId = localStorage.getItem('sessionId');
    const accessId = localStorage.getItem('accessId');

    if (isExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }

    setAuthState({
      isAuthenticated: !isExpired,
      user,
      sessionId: sessionId || '',
      accessId: accessId || '',
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
