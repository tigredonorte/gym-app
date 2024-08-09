// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageType = any;

export interface ILogger {
  log: (message: MessageType, ...optionalParams: MessageType[]) => void;
  info: (message: MessageType, ...optionalParams: MessageType[]) => void;
  warn: (message: MessageType, ...optionalParams: MessageType[]) => void;
  error: (message: MessageType, ...optionalParams: MessageType[]) => void;
}


export const getUserData = () => {
  const userDataString = localStorage.getItem('user');
  if (!userDataString) {
    return null;
  }

  try {
    const user = JSON.parse(userDataString);
    return {
      id: user?.id as string || '',
      email: user?.email as string || '',
      username: user?.name as string || '',
    };
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
    return null;
  }
};
