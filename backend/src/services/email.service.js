const nodemailer = require("nodemailer");

let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

const sendOtpEmail = async (email, otp) => {
  if (!transporter) {
    console.log(`OTP for ${email}: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "KTR-KART Email Verification OTP",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`
  });
};

module.exports = { sendOtpEmail };
