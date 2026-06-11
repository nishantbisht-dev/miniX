const nodemailer = require("nodemailer");

/*
  sendEmail is a reusable email utility.

  We will use this for:
  - OTP emails
  - password reset emails
  - invoice emails
  - subscription emails
*/

async function sendEmail({ to, subject, html }) {
  /*
    Create email transporter using SMTP credentials from .env.
  */
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  /*
    Send actual email.
  */
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;