import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketClient } from './WebSocketClient';
import { EnvContext } from '../EnvContext';

export const WebSocketContext = createContext<WebSocketClient | null>(null);

export const WebSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [webSocketClient, setWebSocketClient] = useState<WebSocketClient | null>(null);
  const { websocketEndpoint } = useContext(EnvContext);

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

  return (
    <WebSocketContext.Provider value={webSocketClient}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketClient => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
