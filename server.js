const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// 🔐 STK PUSH ROUTE
app.post("/stkpush", async (req, res) => {
  try {
    let { phone, amount } = req.body;

    // format phone number
    if (phone.startsWith("0")) {
      phone = "254" + phone.substring(1);
    }

    const response = await axios.post(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        amount: amount,
        phone_number: phone,
        channel_id: 133,
        provider: "m-pesa",
        external_reference: "INV-" + Date.now(),
        customer_name: "Customer",
        callback_url: "https://your-app-name.onrender.com/callback"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.PAYHERO_API_KEY
        }
      }
    );

    res.json({ success: true, data: response.data });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Payment failed"
    });
  }
});


// 📩 CALLBACK (VERY IMPORTANT)
app.post("/callback", (req, res) => {

  console.log("PAYMENT CALLBACK:", req.body);

  // Later we will:
  // ✅ verify payment
  // ✅ activate bundle

  res.sendStatus(200);
});


app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
