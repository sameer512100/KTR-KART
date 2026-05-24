const nodemailer = require("nodemailer");

let transporter = null;
const resendApiKey = process.env.RESEND_API_KEY;

class EmailDeliveryError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "EmailDeliveryError";
    this.cause = cause;
  }
}

const sendWithResend = async (email, otp) => {
  const resendFrom = process.env.RESEND_FROM || "KTR-KART <noreply@ktrkartsrm.online>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: resendFrom,
      to: [email],
      subject: "KTR-KART Email Verification OTP",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your KTR-KART OTP is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Resend API failed with status ${response.status}`);
  }
};

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 15000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

const sendOtpEmail = async (email, otp) => {
  if (resendApiKey) {
    try {
      await sendWithResend(email, otp);
      return;
    } catch (error) {
      throw new EmailDeliveryError("Could not send OTP email. Please try again later.", error);
    }
  }

  if (!transporter) {
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "KTR-KART Email Verification OTP",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`
    });
  } catch (error) {
    throw new EmailDeliveryError("Could not send OTP email. Please try again later.", error);
  }
};

module.exports = { sendOtpEmail, EmailDeliveryError };
