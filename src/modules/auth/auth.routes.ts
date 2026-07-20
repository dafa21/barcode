import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../../db/index.ts';
import { users, offices } from '../../db/schema.ts';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const userResult = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult[0];
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, officeId: user.officeId, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role, officeId: user.officeId } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register-super-admin', async (req, res) => {
  // Utility endpoint just for initial setup (in a real app, this should be protected or run via seed script)
  try {
    const { username, password } = req.body;
    const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await db.insert(users).values({
      username,
      passwordHash: hash,
      role: 'super_admin'
    }).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

export default router;

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
