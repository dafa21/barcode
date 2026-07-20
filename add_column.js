import { db } from './src/db/index.ts';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`ALTER TABLE events ADD COLUMN gallery text;`);
  console.log("Column added");
  process.exit(0);
}
main().catch(console.error);
