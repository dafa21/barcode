const fs = require('fs');

async function testWappinTemplates() {
  const wappinClientName = "undangan";
  const wappinToken = "hhE2Z80Q168*";
  const basicAuth = Buffer.from(`${wappinClientName}:${wappinToken}`).toString('base64');
  
  const tokenRes = await fetch('https://api.chat.wappin.app/v1/users/login', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basicAuth}` }
  });
  
  const tokenData = await tokenRes.json();
  const activeBearerToken = tokenData.users?.[0]?.token;

  const res = await fetch('https://api.chat.wappin.app/v1/templates', {
    headers: { 'Authorization': `Bearer ${activeBearerToken}` }
  });
  
  console.log("Status:", res.status);
  const data = await res.json();
  fs.writeFileSync('templates.json', JSON.stringify(data, null, 2));
  console.log("Templates saved to templates.json");
}

testWappinTemplates().catch(console.error);
