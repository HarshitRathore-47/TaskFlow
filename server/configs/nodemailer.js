import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Helps with connection stability in cloud environments
  }
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
