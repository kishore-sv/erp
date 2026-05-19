import { Queue } from "bullmq";
import * as dotenv from "dotenv";

dotenv.config();

// const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// export const emailQueue = new Queue("emailQueue", {
//   connection: {
//     url: redisUrl,
//   },
// });

// export const sendEmailJob = async (to: string, subject: string, text: string) => {
//   await emailQueue.add("sendEmail", { to, subject, text }, {
//     attempts: 3,
//     backoff: {
//       type: "exponential",
//       delay: 1000,
//     },
//   });
// };
