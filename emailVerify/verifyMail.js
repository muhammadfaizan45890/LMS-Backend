// import nodemailer from "nodemailer";
// import 'dotenv/config';
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import handlebars from "handlebars";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const verifyMail = async (token, email) => {
//     const emailTemplateSource = fs.readFileSync(
//         path.join(__dirname, "template.hbs"),
//         "utf-8"
//     );

//     const template = handlebars.compile(emailTemplateSource);
//     const htmlToSend = template({ token: encodeURIComponent(token) });

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.MAIL_USER,
//             pass: process.env.MAIL_PASS
//         },
//         tls: {
//             rejectUnauthorized: false // <-- prevents self-signed certificate error
//         }
//     });

//     const mailConfigurations = {
//         from: process.env.MAIL_USER,
//         to: email,
//         subject: 'Email Verification',
//         html: htmlToSend,
//     };

//     try {
//         await transporter.sendMail(mailConfigurations);
//         console.log("Verification email sent to", email);
//     } catch (error) {
//         console.log("Email sending failed:", error.message);
//         // Do NOT throw; backend continues
//     }
// }






import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

// ================= PATH FIX =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= TRANSPORTER (MOVE OUTSIDE) =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Optional: verify connection (helps debug Railway)
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error.message);
  } else {
    console.log("SMTP READY ✔");
  }
});

// ================= EMAIL FUNCTION =================
export const verifyMail = async (token, email) => {
  try {
    // Load template
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "template.hbs"),
      "utf-8"
    );

    const template = handlebars.compile(emailTemplateSource);

    const htmlToSend = template({
      token: encodeURIComponent(token),
    });

    // Mail config
    const mailConfigurations = {
      from: `"LMS System" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email Verification",
      html: htmlToSend,
    };

    // Send mail
    const info = await transporter.sendMail(mailConfigurations);

    console.log("Verification email sent ✔:", info.messageId);
  } catch (error) {
    console.log("Email sending failed ❌:", error.message);
  }
};
