import nodemailer from "nodemailer";
import fs from "fs";

async function sendEmail() {
  // GitHub artifact link
  const artifactLink = `https://github.com/${process.env.GITHUB_REPO}/actions/runs/${process.env.GITHUB_RUN_ID}`;

  // Load Playwright summary
  const summaryFile = "playwright-report/.last-run.json";
  let summary = {};
  if (fs.existsSync(summaryFile)) {
    summary = JSON.parse(fs.readFileSync(summaryFile, "utf-8"));
  }

  const passed = summary.stats?.expected || 0;
  const failed = summary.stats?.unexpected || 0;
  const skipped = summary.stats?.skipped || 0;
  const duration = summary.stats?.duration ? (summary.stats.duration / 1000).toFixed(2) : "N/A";

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata"
  });

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>✅ Playwright Test Execution Report</h2>

    <p>Hi Team,</p>
    <p>The automated test execution has been completed. Below is the summary:</p>

    <h3>📊 Test Summary</h3>
    <table style="border-collapse: collapse; width: 400px;">
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Passed</td>
        <td style="border: 1px solid #ccc; padding: 8px; color: green; font-weight: bold;">${passed}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Failed</td>
        <td style="border: 1px solid #ccc; padding: 8px; color: red; font-weight: bold;">${failed}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Skipped</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${skipped}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Duration</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${duration} seconds</td>
      </tr>
    </table>

    <br>

    <p><b>🕒 Execution Time:</b> ${timestamp}</p>

    <h3>📁 Download Allure Report</h3>
    <p>
      Click the link below to view and download the complete Allure Report:
      <br><br>
      <a href="${artifactLink}" style="color: #1a73e8; font-size: 15px;">
        🔗 View Allure Report Artifact
      </a>
    </p>

    <br>
    <p>Regards,<br><b>Automation Bot</b></p>
  </div>
  `;

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
    subject: "📌 Playwright CI Report – Summary + Allure Link",
    html: htmlBody
  });

  console.log("Advanced HTML Email sent successfully!");
}

sendEmail().catch(console.error);
