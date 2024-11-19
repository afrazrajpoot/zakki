const express = require("express");
const app = express();
const cors = require("cors");
const createBooking = require("./route/bookingRoute");
const userRoute = require("./route/userRoute");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const blogRoute = require("./route/blog");
// Middleware
app.use(cors("*")); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/v1", createBooking); 
app.use( "/api/v1",blogRoute);
// Error handler
app.use("/api/v1", userRoute);
app.use(express.static('public'));
app.post('/payment-sheet', async (req, res) => {
  try {
    const { amount, img } = req.body; // Amount in pounds

    let productImages = img
    // Check if the amount is valid
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).send('Invalid amount');
    }

    // Convert pounds to pence
    const amountInPence = amount * 100;

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp', // Currency in GBP
          product_data: {
            name: 'Service Payment',
            images: [productImages],
          },
          unit_amount: amountInPence, // Amount in pence
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://www.funrides.co.uk/success`,
      // success_url: `http://localhost:5173/success`,

      cancel_url: `https://www.funrides.co.uk/`,
      // cancel_url: `http://localhost:5173`,

    });
        
    // Respond with the sessionIdbookingDetai
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Checkout Session:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.all("*", (req, res) => {
  res.status(404).send("Not Found");
});
app.use(require("./error/errorMiddelware"));

module.exports = app;
