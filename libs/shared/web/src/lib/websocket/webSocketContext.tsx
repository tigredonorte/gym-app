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
  const { websocketEndpoint } = useContext(EnvContext);
  const [isConnected, setIsConnected] = useState<boolean>();

  useEffect(() => {
    if (websocketEndpoint) {
      const client = new WebSocketClient(websocketEndpoint as string);
      client.connect();
      setWebSocketClient(client);
      return () => {
        client.disconnect();
      };
    }
  }, [websocketEndpoint]);

  useEffect(() => {
    webSocketClient?.connectionStatusChange(setIsConnected);
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
