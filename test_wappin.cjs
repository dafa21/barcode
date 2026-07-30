
async function testWappin() {
  const wappinClientName = "undangan";
  const wappinToken = "hhE2Z80Q168*";
  
  const loginUrl = 'https://api.chat.wappin.app/v1/users/login';
  const basicAuth = Buffer.from(`${wappinClientName}:${wappinToken}`).toString('base64');
  
  console.log("Logging into Wappin...");
  const tokenRes = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basicAuth}` }
  });
  
  if (!tokenRes.ok) {
    console.error("Login failed!", await tokenRes.text());
    return;
  }
  
  const tokenData = await tokenRes.json();
  const activeBearerToken = tokenData.users?.[0]?.token;
  
  console.log("Logged in! Token acquired.");
  
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
                link: "https://undangan.laznasdewandakwah.or.id/wappin_pdf/test_123.pdf", // Dummy link that we know works (Cloudflare won't block its own static file if it doesn't check it? Wait, let's use a dummy external PDF to be absolutely sure)
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
            { type: "text", text: "https://undangan.laznasdewandakwah.or.id/wappin_pdf/test_123.pdf" },
            { type: "text", text: "https://undangan.laznasdewandakwah.or.id/rsvp/test1234" }
          ]
        }
      ]
    }
  };
  
  // Let's use an external dummy PDF just to rule out domain blocking entirely
  payload.template.components[0].parameters[0].document.link = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  payload.template.components[1].parameters[5].text = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

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

testWappin().catch(console.error);
