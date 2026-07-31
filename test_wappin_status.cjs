

async function test() {
  const wappinClientName = "undangan";
  const wappinToken = "hhE2Z80Q168*";
  const basicAuth = Buffer.from(`${wappinClientName}:${wappinToken}`).toString('base64');
  
  const tokenRes = await fetch('https://api.chat.wappin.app/v1/users/login', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basicAuth}` }
  });
  
  const tokenData = await tokenRes.json();
  const activeBearerToken = tokenData.users?.[0]?.token;

  const msgId = "QWxnemcwZkh2WnFwXzdIMlAxNUVM"; // from test_wappin6.cjs
  
  const res = await fetch(`https://api.chat.wappin.app/v1/messages/${msgId}`, {
    headers: { 'Authorization': `Bearer ${activeBearerToken}` }
  });
  
  console.log(res.status);
  console.log(await res.text());
}
test().catch(console.error);
