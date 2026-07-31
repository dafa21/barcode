const fs = require('fs');

async function testWappinMedia() {
  const wappinClientName = "undangan";
  const wappinToken = "hhE2Z80Q168*";
  
  const loginUrl = 'https://api.chat.wappin.app/v1/users/login';
  const basicAuth = Buffer.from(`${wappinClientName}:${wappinToken}`).toString('base64');
  
  console.log("Logging into Wappin...");
  const tokenRes = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basicAuth}` }
  });
  
  const tokenData = await tokenRes.json();
  const activeBearerToken = tokenData.users?.[0]?.token;
  console.log("Token acquired:", activeBearerToken);
  
  // create dummy pdf
  fs.writeFileSync('dummy.pdf', '%PDF-1.4 dummy pdf content for testing');

  console.log("Uploading to Wappin Media API...");
  // Upload to Wappin Media API using raw buffer
  const fileBuffer = fs.readFileSync('dummy.pdf');

  const mediaHeaders = {
    'Content-Type': 'application/pdf',
    'Authorization': `Bearer ${activeBearerToken}`,
    'Wappin-Project-Id': 'awd'
  };

  const mediaRes = await fetch('https://api.chat.wappin.app/v1/media', {
    method: 'POST',
    headers: mediaHeaders,
    body: fileBuffer
  });

  console.log("Media Upload Status:", mediaRes.status);
  const mediaText = await mediaRes.text();
  console.log("Media Upload Body:", mediaText);
}

testWappinMedia().catch(console.error);
