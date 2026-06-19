const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('PayHero API running 🚀');
});

// STK Push
app.post('/stk', async (req, res) => {
  try {
    const { phone, amount } = req.body;

    const response = await axios.post(
      'https://backend.payhero.co.ke/api/v2/payments',
      {
        phone_number: phone,
        amount: amount
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// Dummy status (for now)
app.post('/status', (req, res) => {
  res.json({ paid: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running...'));
