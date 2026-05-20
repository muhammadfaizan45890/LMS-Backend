import nodemailer from "nodemailer";
import "dotenv/config";

/**
 * Send an OTP email to a user
 * @param {string} email - Recipient email address
 * @param {string|number} otp - OTP code to send
 * @param {Object} options - Optional config
 * @param {string} options.subject - Email subject
 * @param {number} options.expiryMinutes - OTP expiry in minutes
 */
export const sendOtpMail = async (
  email,
  otp,
  { subject = "Your OTP Code", expiryMinutes = 10 } = {}
) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error("MAIL_USER or MAIL_PASS not defined in environment variables");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Modern Developer Style Email (Source Code Pro)
    const htmlContent = `
      <div style="
        background:#ffffff;
        padding:40px 20px;
        font-family: 'Source Code Pro', monospace;
      ">
        <div style="
          max-width:600px;
          margin:0 auto;
          background:#ffffff;
          border:1px solid #000000;
          border-radius:8px;
          overflow:hidden;
        ">
          
          <!-- Header -->
          <div style="
            padding:25px 40px;
            border-bottom:1px solid #000000;
            text-align:center;
          ">
            <h2 style="
              margin:0;
              font-weight:600;
              color:#000000;
              letter-spacing:1px;
            ">
              ${subject}
            </h2>
          </div>

          <!-- Body -->
          <div style="padding:40px;">
            <p style="font-size:14px; color:#000000; margin-bottom:20px;">
              > Hello,
            </p>

            <p style="font-size:14px; color:#000000; margin-bottom:25px;">
              Use the verification code below to proceed:
            </p>

            <!-- OTP Box -->
            <div style="text-align:center; margin:35px 0;">
              <div style="
                display:inline-block;
                padding:18px 40px;
                font-size:28px;
                letter-spacing:8px;
                font-weight:700;
                background:#ffffff;
                border:2px solid #000000;
                color:#000000;
              ">
                ${otp}
              </div>
            </div>

            <p style="font-size:13px; color:#000000; margin-top:30px;">
              This code expires in ${expiryMinutes} minutes.
            </p>

            <p style="font-size:12px; color:#555555; margin-top:25px;">
              If you did not request this, you may ignore this message.
            </p>
          </div>

          <!-- Footer -->
          <div style="
            padding:15px 40px;
            border-top:1px solid #000000;
            text-align:center;
          ">
            <p style="font-size:11px; color:#777777; margin:0;">
              © ${new Date().getFullYear()} Your App — Secure Authentication System
            </p>
          </div>

        </div>
      </div>
    `;

    const textContent = `Your OTP code is: ${otp}. It is valid for ${expiryMinutes} minutes. If you didn't request this, please ignore this email.`;

    const mailOptions = {
      from: `"Your App" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html: htmlContent,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}: ${info.response}`);
    return info;

  } catch (err) {
    console.error(`❌ Failed to send OTP email to ${email}:`, err.message);
    throw err;
  }
};
