import mailgun from "mailgun-js";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Function to Read HTML Templates (Fix Path Issue)
const getHtmlTemplate = (fileName, replacements) => {
  const filePath = path.join(__dirname, "../emailTemplates", fileName); // ✅ Corrected path

  if (!fs.existsSync(filePath)) {
    throw new Error(`Email template not found: ${filePath}`);
  }

  let html = fs.readFileSync(filePath, "utf-8");

  // ✅ Replace placeholders dynamically
  for (const key in replacements) {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
  }

  return html;
};

// ✅ Function to Send Emails with HTML Template
export const sendEmail = async (to, subject, templateName, replacements) => {
  const emailData = {
    from: `NutriTrack <${process.env.MAILGUN_FROM_EMAIL}>`,
    to,
    subject,
    html: getHtmlTemplate(templateName, replacements), // ✅ Use HTML template instead of plain text
  };

  return new Promise((resolve, reject) => {
    mg.messages().send(emailData, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};
