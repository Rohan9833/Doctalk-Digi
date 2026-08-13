// utils/brevoEmail.js
require("dotenv").config();

const sendEmailViaBrevo = async ({ to, subject, htmlContent, senderName }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    throw new Error("Missing Brevo credentials in environment variables.");
  }

  const payload = {
    sender: {
      name: senderName || process.env.BREVO_SENDER_NAME || "DocTalk Quiz",
      email: senderEmail,
    },
    to: [
      {
        email: to.email,
        name: to.name || "",
      },
    ],
    subject: subject,
    htmlContent: htmlContent,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Brevo API Error:", result);
      throw new Error(`Brevo API Error: ${result.message || JSON.stringify(result)}`);
    }

    console.log(`✅ Email sent successfully to ${to.email}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Failed to send email via Brevo:", error.message);
    throw error;
  }
};

module.exports = sendEmailViaBrevo;