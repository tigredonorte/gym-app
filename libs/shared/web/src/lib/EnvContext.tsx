import React, { createContext, useContext } from 'react';

type Env = Record<string, string | number>;

interface EnvProviderProps {
  children: React.ReactNode;
  env: Env;
}

export const EnvContext = createContext<Env>({});

export const EnvProvider: React.FC<EnvProviderProps> = ({ children, env }) => {
  if (!env) {
    env = {};
  }
  return (
    <EnvContext.Provider value={env}>
      {children}
    </EnvContext.Provider>
  );
};

export const useEnv = (): Env => {
  const context = useContext(EnvContext);
  if (!context) {
    throw new Error('useEnv must be used within an EnvProvider');
  }
  return context;
};