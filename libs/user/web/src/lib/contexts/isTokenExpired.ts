import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
}

export const getTokenTimeExpiration = (token: string | null): number => {
  if (!token) {
    return 0;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (!decoded.exp) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpire = (decoded.exp - currentTime) * 1000;
    return timeToExpire;
  } catch (error) {
    console.error('Invalid token:', error);
    return 0;
  }
};
