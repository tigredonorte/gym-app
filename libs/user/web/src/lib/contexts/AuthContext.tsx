import { CrudBox, HttpError, postRequest, WebSocketContext } from '@gym-app/shared/web';
import { IUser } from '@gym-app/user/types';
import { mdiLoading } from '@mdi/js';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../reducer/UserActions';
import { getTokenTimeExpiration } from './isTokenExpired';

interface AuthData {
  token: string
  accessId: string
  sessionId: string
  refreshToken: string
}

const initialState = {
  isAuthenticated: undefined,
  user: null,
  sessionId: '',
  accessId: '',
  online: false,
  refreshToken: '',
};

export interface AuthContextType extends Omit<AuthData, 'token'> {
  online: boolean;
  isAuthenticated?: boolean;
  user: IUser | null;
  logout: (callback?: (sessionId: string, accessId: string) => Promise<void>) => void;
  login: (data: { email: string, password: string }) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  logoutUser: (sessionId: string, accessId: string, refreshToken: string) => Promise<void>;
}
const AuthProviderFn: React.FC<React.PropsWithChildren<AuthProviderProps>> = ({ children, logoutUser }) => {
  const { webSocketClient, isConnected } = React.useContext(WebSocketContext);
  const [authState, setAuthState] = useState<Omit<AuthContextType, 'logout' | 'login'>>(initialState);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const clearAuthTimeout = useCallback((timeoutId: NodeJS.Timeout | null) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, []);

  const logout = useCallback(async () => {
    const sessionId = localStorage.getItem('sessionId');
    const accessId = localStorage.getItem('accessId');
    const userRefreshToken = localStorage.getItem('userRefreshToken');
    try {
      webSocketClient?.channelClear();
      await logoutUser(sessionId as string, accessId as string, userRefreshToken as string);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('accessId');
    setAuthState({
      ...initialState,
      isAuthenticated: false,
    });
    clearAuthTimeout(timeoutId);
  }, [logoutUser, clearAuthTimeout, webSocketClient]);


  const setNewToken = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    clearAuthTimeout(timeoutId);
    const timeToExpire = getTokenTimeExpiration(newToken);
    if (timeToExpire > 0) {
      const newTimeoutId = setTimeout(() => refreshToken(), timeToExpire - 5000);
      setTimeoutId(newTimeoutId as unknown as NodeJS.Timeout);
    }
  }, [clearAuthTimeout]);

  const refreshToken = useCallback(async (retry = 0, timeout = 5000) => {
    try {
      const userRefreshToken = localStorage.getItem('userRefreshToken');
      const response = await postRequest<{ token: string, userRefreshToken?: string }>('/auth/refreshToken', { userRefreshToken });
      const newToken = response.token;
      setNewToken(newToken);
    } catch (error) {
      if (error instanceof HttpError && error.status >= 500 && retry++ < 3) {
        if (error.message === 'Failed to fetch') {
          console.warn(`Failed to refresh token, retrying in ${timeout}ms`);
          setTimeout(() => refreshToken(retry, 2 * timeout + Math.random() * 1000), timeout);
          return;
        }
      }
      console.error('Failed to refresh token:', error);
      logout();
    }
  }, [setNewToken, logout]);

  const listenUserChanges = useCallback((data: {
    userId: string,
    accessId: string,
    sessionId: string
  }) => {
    const { userId, accessId } = data;
    if (!webSocketClient) {
      console.warn('WebSocket client not available');
      return;
    }

    if (!userId) {
      console.warn('userId not provided, clearing channels');
      webSocketClient?.channelClear();
      return;
    }

    if (!isConnected) {
      console.warn('WebSocket not connected, clearing channels');
      webSocketClient?.channelClear();
      return;
    }

    webSocketClient.channelSubscribe(`user.${userId}`);
    webSocketClient.channelSubscribe(`session.${accessId}`);
    webSocketClient.on(`user.${userId}.update`, (user: IUser) => {
      localStorage.setItem('userData', JSON.stringify(user));
      user.blocked && logout();
    });
    webSocketClient.on(`user.${userId}.delete`, () => logout());
    webSocketClient.on(`session.${accessId}.logout`, () => logout());
  }, [webSocketClient, isConnected, logout]);

  const login = useCallback(async (data: { email: string, password: string }) => {
    try {
      const { token, accessId, sessionId, refreshToken, ...user } = await postRequest<AuthData & IUser>('/auth/login', data);
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('accessId', accessId);
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('userRefreshToken', refreshToken);
      setNewToken(token);
      listenUserChanges({
        userId: user.id,
        accessId,
        sessionId,
      });
      setAuthState((prevState) => ({
        ...prevState,
        isAuthenticated: true,
        accessId,
        sessionId,
        refreshToken,
        user,
      }));

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [setNewToken, listenUserChanges]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const timeToExpire = getTokenTimeExpiration(token);
    const isExpired = timeToExpire <= 0;
    const user = !isExpired ? JSON.parse(localStorage.getItem('userData') as string) : null;
    const sessionId = localStorage.getItem('sessionId');
    const accessId = localStorage.getItem('accessId');

    if (isExpired || !user) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    } else {
      listenUserChanges({
        userId: user.id,
        accessId: accessId as string,
        sessionId: sessionId as string,
      });
    }

    setAuthState((prevState) => ({
      ...prevState,
      isAuthenticated: !isExpired,
      user,
      sessionId: sessionId as string,
      accessId: accessId as string,
    }));

    if (timeToExpire > 0) {
      const newTimeoutId = setTimeout(() => refreshToken(), timeToExpire - 1000);
      setTimeoutId(newTimeoutId as unknown as NodeJS.Timeout);
    }
  }, [refreshToken, listenUserChanges]);

  if (authState.isAuthenticated === undefined) {
    return (<CrudBox text="Authenticating..." icon={mdiLoading} color='info' />);
  }

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

export const AuthProvider = connect(
  () => ({}),
  {
    logoutUser,
  }
)(AuthProviderFn);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
