import fs from 'fs';
import https from 'https';
import FormData from 'form-data';

const form = new FormData();
form.append('file', fs.createReadStream('app.tar.gz'));

const req = https.request({
  hostname: 'file.io',
  path: '/?expires=1d',
  method: 'POST',
  headers: form.getHeaders()
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});

req.on('error', console.error);
form.pipe(req);
