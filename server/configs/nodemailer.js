const sendEmail = async ({ to, subject, body, replyTo }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Taskflow",
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: body,
        replyTo: replyTo ? { email: replyTo } : { email: process.env.SENDER_EMAIL },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send email via Brevo API");
    }

    return data;
  } catch (error) {
    console.error("Brevo API Error:", error);
    throw error;
  }
};

export default sendEmail;
