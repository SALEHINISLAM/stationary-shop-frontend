// src/types/jwt.ts
export type JwtPayload = {
    email: string;
    role: string;  // Or use your specific role type (TUserRole)
    iat: number;   // Issued at timestamp
    exp: number;   // Expiration timestamp
    
  };

export function decodeJWT(token: string): JwtPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      throw new Error('Invalid token format');
    }
  }