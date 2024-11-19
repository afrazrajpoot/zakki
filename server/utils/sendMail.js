const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs").promises;

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URL = process.env.REDIRECT_URL
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

// Set up OAuth2 client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Create a transporter object with OAuth2 configuration
async function createTransporter() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'funride907@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
    
    // Verify transporter configuration
    await transporter.verify();
    return transporter;
  } catch (error) {
    console.error('Error creating transporter:', error);
    throw error;
  }
}

// Send email function using EJS template
async function sendEmail(to, subject, templateData) {
  // Input validation
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    throw new Error('Invalid recipient email address');
  }
  
  if (!subject) {
    throw new Error('Email subject is required');
  }
  
  if (!templateData || typeof templateData !== 'object') {
    throw new Error('Template data must be provided as an object');
  }

  try {
    const transporter = await createTransporter();
    
    // Read and render the EJS template using promises
    const templatePath = path.join(__dirname, "../views/mail.ejs");
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const renderedHtml = await ejs.render(templateContent, templateData);
    const mailOptions = {
      from: {
        name: 'Funride',
        address: 'funride907@gmail.com'
      },
      to: to.trim(), // Ensure no whitespace in email address
      subject: subject,
      text: `Hello, your booking has been confirmed!`,
      html: renderedHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error for proper handling by the caller
  }
}

module.exports = sendEmail;
