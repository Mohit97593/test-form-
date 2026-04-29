const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const mongoose = require('mongoose');
const Order = require('./models/Order');

dotenv.config();

const sendCheckoutEmail = async (data, orderId) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "Checkout App", email: "mohitanshu7800@gmail.com" },
        to: [{ email: "mohitanshu7800@gmail.com", name: "Mohitanshu" }],
        subject: "New Checkout Order Received! 🚀",
        htmlContent: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #2563eb;">New Order: ${orderId}</h2>
              <p><strong>Customer Name:</strong> ${data.firstName} ${data.lastName}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Username:</strong> ${data.username}</p>
              <p><strong>Address:</strong> ${data.address}, ${data.state}, ${data.country} - ${data.zip}</p>
              <hr />
              <h3>Payment Details</h3>
              <p><strong>Method:</strong> ${data.paymentMethod}</p>
              <p><strong>Card Name:</strong> ${data.ccName}</p>
              <p><strong>Order Time:</strong> ${new Date().toLocaleString()}</p>
            </body>
          </html>
        `
      })
    });

    if (response.ok) {
      console.log('Notification email sent successfully via API!');
    } else {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('*', async (req, res) => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    const checkoutData = req.body;
    console.log('Received Checkout Data:', checkoutData);

    if (!checkoutData.firstName || !checkoutData.lastName || !checkoutData.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: First Name, Last Name, and Email are mandatory.' 
      });
    }

    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const newOrder = new Order({
      ...checkoutData,
      orderId
    });

    await newOrder.save();
    console.log('Order saved to DB');

    await sendCheckoutEmail(checkoutData, orderId);

    res.status(200).json({
      success: true,
      message: 'Order processed successfully!',
      orderId
    });
  } catch (error) {
    console.error('SERVER ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message,
      debug: error.stack
    });
  }
});

app.get('/', (req, res) => {
  res.send('Checkout API is running...');
});

module.exports = app;
