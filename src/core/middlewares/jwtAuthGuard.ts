import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    officeId: string;
    role: string;
  };
}

export const jwtAuthGuard = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name !== 'TokenExpiredError') {
      console.error('Error verifying JWT token:', error);
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
