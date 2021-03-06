import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, process.env.jwt_secret || '') as Record<
      string,
      string
    >;
  } catch {
    return null;
  }
}

export function validateJwtMiddleware() {
  return expressJwt({
    secret: process.env.jwt_secret || '',
    algorithms: ['HS256']
  });
}

export function handleAuthError() {
  return (err: any, req: any, res: any, next: any) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token');
    }
  };
}

export function createJwt(user: Record<string, string>) {
  const token = jwt.sign(
    {
      username: user.username,
      name: user.name,
      userId: user['user-id']
    },
    process.env.jwt_secret || '',
    {
      subject: user.email
    }
  );

  return token;
}
