import "dotenv/config";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import * as schema from './src/db/schema.ts';
import { users } from './src/db/schema.ts';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('Seeding super_admin...');
  const hash = await bcrypt.hash('password123', 10);
  
  await db.insert(users).values({
    username: 'admin',
    passwordHash: hash,
    role: 'super_admin'
  });
  
  console.log('Super admin created! Username: admin, Password: password123');
  process.exit(0);
}

seed().catch(console.error);
