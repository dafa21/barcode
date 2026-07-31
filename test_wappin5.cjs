const fs = require('fs');

async function testWappinFull() {
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
  
  // create dummy pdf
  fs.writeFileSync('dummy2.pdf', '%PDF-1.4 dummy pdf content for testing');
  const fileBuffer = fs.readFileSync('dummy2.pdf');

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

  const mediaJson = await mediaRes.json();
  const mediaId = mediaJson.media[0].id;
  console.log("Media Uploaded! ID:", mediaId);

  const payload = {
    messaging_product: "whatsapp",
    to: "6281283767931",
    type: "template",
    template: {
      name: "undangan_dai",
      language: {
        policy: "deterministic",
        code: "id"
      },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "document",
              document: {
                id: mediaId,
                filename: "Undangan_Test.pdf"
              }
            }
          ]
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: "Tamu Test" },
            { type: "text", text: "Acara Test" },
            { type: "text", text: "Kamis, 30 Juli 2026" },
            { type: "text", text: "09:00" },
            { type: "text", text: "Jakarta" },
            { type: "text", text: "Link Test" },
            { type: "text", text: "RSVP Test" }
          ]
        }
      ]
    }
  };
  
  console.log("Sending payload to Wappin...");
  const sendUrl = 'https://api.chat.wappin.app/v1/messages';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${activeBearerToken}`,
    'Wappin-Project-Id': 'awd'
  };
  
  const response = await fetch(sendUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  
  console.log("Wappin Response Status:", response.status);
  const data = await response.json();
  console.log("Wappin Response Body:", JSON.stringify(data, null, 2));
}

testWappinFull().catch(console.error);
