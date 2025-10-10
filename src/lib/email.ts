export const runtime = "nodejs";

import nodemailer from "nodemailer";
import db from "./db";

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  const admin = await db.admin.findFirst();

  if (!admin) {
    throw new Error("No admin found");
  }

  const userCredential = admin.gmailSmtp || process.env.SMTP_EMAIL!;
  const passCredential = admin.appPasswordSmtp || process.env.SMTP_PASSWORD!;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userCredential,
      pass: passCredential,
    },
  });

  await transporter.sendMail({
    from: userCredential,
    to,
    subject,
    text,
    html, // ✅ allow HTML template
  });
}
