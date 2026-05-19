import { Worker, Job } from "bullmq";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

// const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// // Configure Nodemailer transporter (Production ready: SES, Resend SMTP, Mailgun, etc.)
// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
//     port: parseInt(process.env.SMTP_PORT || "2525"),
//     secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
//     auth: {
//         user: process.env.SMTP_USER || "user",
//         pass: process.env.SMTP_PASS || "pass"
//     }
// });

// export const emailWorker = new Worker(
//   "emailQueue",
//   async (job: Job) => {
//     const { to, subject, text } = job.data;
    
//     console.log(`[EmailWorker] Sending email to ${to}...`);
    
//     await transporter.sendMail({
//       from: '"ERP System" <noreply@erp.com>',
//       to,
//       subject,
//       text,
//     });
    
//     console.log(`[EmailWorker] Email sent to ${to}`);
//   },
//   {
//     connection: {
//       url: redisUrl,
//     },
//   }
// );

// emailWorker.on("completed", (job) => {
//   console.log(`[EmailWorker] Job ${job.id} completed successfully`);
// });

// emailWorker.on("failed", (job, err) => {
//   console.error(`[EmailWorker] Job ${job?.id} failed with error:`, err);
// });
