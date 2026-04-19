import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm/expressions.js";
import { Role } from "../types.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Admin routes",
    });
});

router.post("/add-user", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const [newUser] = await db
            .insert(users)
            .values({
                name,
                email,
                passwordHash: password,
                role: role as Role,
            })
            .returning();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error: any) {
        console.error("Error adding user:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});



export default router;