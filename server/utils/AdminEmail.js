const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs").promises;

// Hostinger email credentials
const HOSTINGER_USER = process.env.HOSTINGER_USER; // Your Hostinger email address
const HOSTINGER_PASS = process.env.HOSTINGER_PASS; // Your Hostinger email password

// Create a transporter object with Hostinger SMTP configuration
async function createTransporter() {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // Hostinger SMTP server
      port: 465, // Use port 465 for secure SMTP (SSL/TLS)
      secure: true, // Use SSL/TLS
      auth: {
        user: HOSTINGER_USER,
        pass: HOSTINGER_PASS,
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
async function AdminEmail(to, subject, templateData) {
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
        address: HOSTINGER_USER
      },
      to: to.trim(),
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

module.exports = AdminEmail;
