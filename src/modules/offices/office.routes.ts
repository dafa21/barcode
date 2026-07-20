import { Router } from 'express';
import { db } from '../../db/index.ts';
import { offices, users } from '../../db/schema.ts';
import { eq } from 'drizzle-orm';
import { jwtAuthGuard, AuthRequest } from '../../core/middlewares/jwtAuthGuard.ts';
import bcrypt from 'bcrypt';

const router = Router();

// Only super_admin can manage offices
const requireSuperAdmin = (req: AuthRequest, res: any, next: any) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden: Super Admin only' });
  }
  next();
};

router.use(jwtAuthGuard, requireSuperAdmin);

router.post('/', async (req, res) => {
  try {
    const { officeName, contactEmail } = req.body;
    const result = await db.insert(offices).values({ officeName, contactEmail }).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

router.get('/', async (req, res) => {
  try {
    const allOffices = await db.select().from(offices);
    res.json(allOffices);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

router.post('/:officeId/admins', async (req, res) => {
  try {
    const { officeId } = req.params;
    const { username, password } = req.body;
    
    const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await db.insert(users).values({
      officeId,
      username,
      passwordHash: hash,
      role: 'office_admin'
    }).returning();
    
    const { passwordHash, ...safeUser } = result[0];
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

export default router;
