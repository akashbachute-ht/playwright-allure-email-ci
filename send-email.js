import nodemailer from "nodemailer";

async function sendEmail() {

  // GitHub build URL for the Allure report artifact
  const reportUrl = `https://github.com/${process.env.GITHUB_REPO}/actions/runs/${process.env.GITHUB_RUN_ID}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <h2>Playwright Automation Report</h2>
    <p>Hi Team,</p>

    <p>The execution is complete. Click below to download/view the Allure Report:</p>

    <a href="${reportUrl}" 
       style="background:#007bff;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">
        🔍 View Allure Report
    </a>

    <br/><br/>
    <p>Regards,<br/>Automation Bot</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "Playwright Allure Report - CI Pipeline",
    html: htmlContent,
  });

  console.log("Email sent successfully!");
}

sendEmail().catch(console.error);
