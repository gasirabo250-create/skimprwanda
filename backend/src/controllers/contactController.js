const asyncHandler = require('../utils/asyncHandler');

// Simple contact form handler. In production, wire this to an email service
// (e.g. Nodemailer + SMTP, Resend, SendGrid) or store submissions in their own collection.
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('name, email and message are required');
  }
  // TODO: send email notification to SKIMP Rwanda team
  console.log('New contact form submission:', { name, email, message });
  res.status(201).json({ success: true, message: 'Message received, we will be in touch soon.' });
});

module.exports = { submitContact };
