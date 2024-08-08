import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketClient } from './WebSocketClient';
import { EnvContext } from '../EnvContext';

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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (websocketEndpoint) {
      console.log(`Creating WebSocket client for server: ${websocketEndpoint}`);
      const client = new WebSocketClient(websocketEndpoint as string);
      client.connect();
      setWebSocketClient(client);
      return () => {
        client.disconnect();
      };
    }
  }, [websocketEndpoint]);

  useEffect(() => {
    if (webSocketClient) {
      webSocketClient.connectionStatusChange((status: boolean) => {
        setIsConnected(status);
      });
    }
  }, [webSocketClient]);

  return (
    <WebSocketContext.Provider value={{
      isConnected,
      webSocketClient
    }}>
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
