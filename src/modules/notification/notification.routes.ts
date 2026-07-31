import { Router } from 'express';

const router = Router();

// Callback URL for Wappin
router.post('/wappin', async (req, res) => {
  try {
    // Wappin will send a POST request with delivery report data
    const payload = req.body;
    
    console.log('--- Wappin Webhook Callback ---');
    console.log('Received payload:', JSON.stringify(payload, null, 2));
    
    const fs = require('fs');
    const path = require('path');
    fs.appendFileSync(path.join(process.cwd(), 'debug-webhook.log'), `[${new Date().toISOString()}] WEBHOOK: ${JSON.stringify(payload)}\n`);
    
    // For now, we simply acknowledge the receipt to Wappin 
    // so they mark the webhook delivery as successful (HTTP 200).
    // If you need to store the delivery status in DB later, you can do it here.

    res.status(200).json({ status: 'success', message: 'Callback received successfully' });
  } catch (error) {
    console.error('Wappin webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// For Wappin URL verification if they use GET
router.get('/wappin', (req, res) => {
  res.status(200).send('Wappin callback endpoint is active.');
});

// Endpoint to view webhook logs
router.get('/debug-webhook-logs', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), 'debug-webhook.log');
    if (fs.existsSync(logPath)) {
      const logs = fs.readFileSync(logPath, 'utf8');
      const lines = logs.split('\n').filter((l: string) => l.trim());
      res.setHeader('Content-Type', 'text/plain');
      return res.send(lines.slice(-100).join('\n'));
    } else {
      return res.status(404).json({ error: 'Log not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
