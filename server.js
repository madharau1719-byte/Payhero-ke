const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// ✅ VERY IMPORTANT (fixes "Failed to fetch")
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get('/', (req, res) => {
  res.send('PayHero API running 🚀');
});

// ✅ STK PUSH ROUTE
app.post('/stk', async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone and amount required"
      });
    }

    const response = await axios.post(
  'https://backend.payhero.co.ke/api/v2/payments',
  {
    amount: amount,
    phone_number: phone,
    channel_id: 9543,
    provider: "m-pesa",
    external_reference: "INV-" + Date.now(),
    customer_name: "Customer",
    callback_url: "https://payhero-ke.onrender.com/callback"
  },
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.API_KEY
    }
  }
);
    
    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error("STK ERROR:");
console.error("Status:", error.response?.status);
console.error("Data:", error.response?.data);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// ✅ CALLBACK (for future real verification)
app.post('/callback', (req, res) => {
  console.log("PAYMENT CALLBACK:", req.body);
  res.sendStatus(200);
});

// ✅ STATUS (temporary fake success)
app.post('/status', (req, res) => {
  res.json({ paid: true });
});

// ✅ REQUIRED FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
