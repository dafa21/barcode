import 'dotenv/config';
import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`ALTER TABLE guests ADD COLUMN IF NOT EXISTS rsvp_updated_at timestamp`);
    console.log("Success adding column");
  } catch (err) {
    console.error("Error adding column:", err);
  }
  process.exit(0);
}

main();
