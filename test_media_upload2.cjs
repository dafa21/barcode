const fs = require('fs');

async function testWappinMedia() {
  const wappinClientName = "undangan";
  const wappinToken = "hhE2Z80Q168*";
  
  const loginUrl = 'https://api.chat.wappin.app/v1/users/login';
  const basicAuth = Buffer.from(`${wappinClientName}:${wappinToken}`).toString('base64');
  
  const tokenRes = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basicAuth}` }
  });
  
  const tokenData = await tokenRes.json();
  const activeBearerToken = tokenData.users?.[0]?.token;
  
  fs.writeFileSync('dummy.pdf', '%PDF-1.4 dummy pdf content for testing');
  const fileBuffer = fs.readFileSync('dummy.pdf');

  const formData = new FormData();
  const file = new File([fileBuffer], 'dummy.pdf', { type: 'application/pdf' });
  formData.append('file', file);

  const mediaHeaders = {
    'Authorization': `Bearer ${activeBearerToken}`,
    'Wappin-Project-Id': 'awd'
  };

  const mediaRes = await fetch('https://api.chat.wappin.app/v1/media', {
    method: 'POST',
    headers: mediaHeaders,
    body: formData
  });

  console.log("Media Upload Status:", mediaRes.status);
  const mediaText = await mediaRes.text();
  console.log("Media Upload Body:", mediaText);
}

testWappinMedia().catch(console.error);
