import { Response, NextFunction } from 'express';
import { AuthRequest } from './jwtAuthGuard.ts';

export const tenantGuard = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
  }

  // Super admin can access anything
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Enforce office_id from token for office_admins
  // We can attach the officeId to req.query or req.body to enforce it in downstream controllers
  const { officeId } = req.user;
  
  if (!officeId) {
    return res.status(403).json({ error: 'Forbidden: No office assigned to user' });
  }

  // You can also just pass the officeId to the next middleware via req.user
  next();
};
