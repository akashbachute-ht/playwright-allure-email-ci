import nodemailer from "nodemailer";
import fs from "fs";

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "Playwright Allure Report",
    text: "Hi Team,\n\nPlease find the attached Allure report.\n\nRegards,\nAutomation Bot",
    attachments: [
      {
        filename: "allure-report.zip",
        path: "./allure-report.zip"
      }
    ]
  });

  console.log("Email sent successfully!");
}

sendEmail().catch(console.error);
