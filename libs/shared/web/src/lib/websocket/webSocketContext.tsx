import { PersistentAlert } from '@gym-app/shared/web';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { EnvContext } from '../EnvContext';
import { WebSocketClient } from './WebSocketClient';

interface WebSocketContextType {
  isConnected: boolean;
  webSocketClient: WebSocketClient | null;
}
export const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  webSocketClient: null
});

export const WebSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [webSocketClient, setWebSocketClient] = useState<WebSocketClient | null>(null);
  const { websocketEndpoint } = useContext<{ websocketEndpoint?: string }>(EnvContext);
  const [isConnected, setIsConnected] = useState<boolean>();

  useEffect(() => {
    if (websocketEndpoint) {
      setWebSocketClient(new WebSocketClient(websocketEndpoint));
    }
  }, [websocketEndpoint]);

  useEffect(() => {
    if (!webSocketClient) {
      return;
    }
    webSocketClient.connect();
    webSocketClient.connectionStatusChange((status) => {
      setIsConnected(status);
    });

    return () => {
      console.warn('Disconnecting WebSocket client');
      webSocketClient?.disconnect();
    };
  }, [webSocketClient]);

  return (
    <WebSocketContext.Provider value={{
      isConnected: isConnected || false,
      webSocketClient
    }}>
      {!isConnected && <PersistentAlert message="Server is offline" severity='warning' />}
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
