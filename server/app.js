
const express = require("express");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/authRoutes");
// Middleware
app.use(cors("*")); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes

// database
const db = require("./db/connection");
db.connect();
app.use("/api/v1", userRoute);
app.use('/api/v1',require('./routes/paymentRoutes'))
app.use(express.static('public'));

app.all("*", (req, res) => {
  res.status(404).send("Not Found");
});
app.use(require("./error/errorMiddelware"));

module.exports = app;
