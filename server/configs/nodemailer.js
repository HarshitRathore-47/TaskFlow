import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525, // Alternate port for cloud environments
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
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
