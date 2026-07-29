import { Router } from 'express';

const router = Router();

// Callback URL for Wappin
router.post('/wappin', async (req, res) => {
  try {
    // Wappin will send a POST request with delivery report data
    const payload = req.body;
    
    console.log('--- Wappin Webhook Callback ---');
    console.log('Received payload:', JSON.stringify(payload, null, 2));
    
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

export default router;
