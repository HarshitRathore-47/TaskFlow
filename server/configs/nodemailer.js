import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true, // Use SSL (Required for Railway)
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true, // Show debug info
  logger: true, // Log to console
});

const sendEmail = async ({ to, subject, body, replyTo }) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: body,
    replyTo: replyTo || process.env.SENDER_EMAIL,
  });

  return response;
};

export default sendEmail;
