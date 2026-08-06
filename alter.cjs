require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().then(() => {
  client.query('ALTER TABLE guests ADD COLUMN rsvp_updated_at timestamp;').then(() => {
    console.log('success');
    process.exit(0);
  }).catch(e => {
    console.log(e.message);
    process.exit(0);
  });
});
