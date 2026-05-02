import { Router } from "express";
import { users } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "../db/redis.js";
import { sendEmailJob } from "../queues/emailQueue.js";
import { checkRateLimit } from "../lib/rateLimit.js";
import { dbPrimary } from "../db/index.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Admin routes",
    });
});

// Admin Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Rate limit logins (e.g., 5 attempts per 15 minutes per email)
        const isAllowed = await checkRateLimit({
            key: `rate_limit:login:${email}`,
            limit: 5,
            windowSeconds: 15 * 60,
        });

        if (!isAllowed) {
            return res.status(429).json({ message: "Too many login attempts. Please try again later." });
        }

        const userResults = await dbPrimary.select().from(users).where(
            and(eq(users.email, email), eq(users.role, "admin"))
        ).limit(1);

        if (userResults.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = userResults[0];
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Clear rate limit on successful login
        await redis.del(`rate_limit:login:${email}`);

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Send OTP for Reset Password
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Rate limit OTP requests (e.g., 3 requests per hour per email)
        const isAllowed = await checkRateLimit({
            key: `rate_limit:otp:${email}`,
            limit: 3,
            windowSeconds: 60 * 60,
        });

        if (!isAllowed) {
            return res.status(429).json({ message: "Too many OTP requests. Please try again later." });
        }

        const userResults = await dbPrimary.select().from(users).where(
            and(eq(users.email, email), eq(users.role, "admin"))
        ).limit(1);

        if (userResults.length === 0) {
            // For security, do not reveal if the user exists
            return res.json({ message: "If your email is registered, an OTP has been sent." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in Redis with 10 minutes expiry
        await redis.setex(`otp:${email}`, 10 * 60, otp);

        // Enqueue email job
        await sendEmailJob(
            email,
            "Password Reset OTP",
            `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
        );

        res.json({ message: "If your email is registered, an OTP has been sent." });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Verify OTP & Reset Password
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }

        const storedOtp = await redis.get(`otp:${email}`);

        if (!storedOtp || storedOtp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const userResults = await dbPrimary.select().from(users).where(
            and(eq(users.email, email), eq(users.role, "admin"))
        ).limit(1);

        if (userResults.length === 0) {
            return res.status(404).json({ message: "Admin user not found" });
        }

        const user = userResults[0];

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await dbPrimary.update(users).set({
            passwordHash: hashedPassword,
        }).where(eq(users.id, user.id));

        // Delete OTP from Redis after successful use
        await redis.del(`otp:${email}`);

        res.json({ message: "Password has been successfully reset" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;