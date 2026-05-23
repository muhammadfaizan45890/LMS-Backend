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
import dns from "dns";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

// ================= FIX IPV4 FOR RAILWAY =================
dns.setDefaultResultOrder("ipv4first");

// ================= PATH FIX =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CHECK ENV VARIABLES =================
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  console.log("❌ MAIL_USER or MAIL_PASS is missing in .env");
}

// ================= TRANSPORTER =================
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

  family: 4,

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// ================= VERIFY SMTP =================
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR ❌");
    console.log(error);
  } else {
    console.log("SMTP READY ✔");
  }
});

// ================= EMAIL FUNCTION =================
export const verifyMail = async (token, email) => {
  try {

    console.log("STARTING EMAIL SEND...");
    console.log("SENDING TO:", email);

    // ================= TEMPLATE PATH =================
    const templatePath = path.join(__dirname, "template.hbs");

    // ================= CHECK TEMPLATE EXISTS =================
    if (!fs.existsSync(templatePath)) {
      console.log("❌ template.hbs not found");
      return false;
    }

    // ================= LOAD TEMPLATE =================
    const emailTemplateSource = fs.readFileSync(
      templatePath,
      "utf-8"
    );

    // ================= COMPILE TEMPLATE =================
    const template = handlebars.compile(emailTemplateSource);

    const htmlToSend = template({
      token: encodeURIComponent(token),
    });

    // ================= MAIL OPTIONS =================
    const mailConfigurations = {
      from: `"LMS System" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email Verification",
      html: htmlToSend,
    };

    // ================= SEND EMAIL =================
    const info = await transporter.sendMail(mailConfigurations);

    console.log("✅ Verification email sent");
    console.log("📩 Message ID:", info.messageId);

    return true;

  } catch (error) {

    console.log("❌ Email sending failed");

    if (error.code) {
      console.log("CODE:", error.code);
    }

    if (error.response) {
      console.log("RESPONSE:", error.response);
    }

    console.log(error.message);

    return false;
  }
};
