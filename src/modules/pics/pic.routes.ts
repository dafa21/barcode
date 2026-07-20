import { Router } from 'express';
import { db } from '../../db/index.ts';
import { users } from '../../db/schema.ts';
import { eq, and } from 'drizzle-orm';
import { jwtAuthGuard, AuthRequest } from '../../core/middlewares/jwtAuthGuard.ts';
import bcrypt from 'bcrypt';

const router = Router();

router.use(jwtAuthGuard);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;
    const officeId = req.user?.officeId;
    
    if (!officeId || req.user?.role !== 'office_admin') {
       return res.status(403).json({ error: 'Only office admin can create PICs' });
    }
    
    const username = name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000);
    const hash = await bcrypt.hash('123456', 10);
    
    const result = await db.insert(users).values({
      officeId,
      username,
      passwordHash: hash,
      role: 'pic'
    }).returning();
    
    const { passwordHash, ...safeUser } = result[0];
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const officeId = req.user?.officeId;
    if (!officeId) return res.status(403).json({ error: 'Forbidden' });
    
    const pics = await db.select({
      id: users.id,
      username: users.username,
      role: users.role
    }).from(users).where(
      and(
        eq(users.officeId, officeId),
        eq(users.role, 'pic')
      )
    );
    res.json(pics);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

export default router;
