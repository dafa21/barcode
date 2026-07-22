const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.wszzlmadzbqevcefdpjm:wV024lHbVDNyoslu@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres' });
client.connect().then(() => client.query('SELECT opening_quote FROM events LIMIT 1').then(res => { console.log(JSON.stringify(res.rows[0])); client.end(); }));
