import express, { Application, Request, Response } from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";

const createServer = (): Application => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Basic check route
  app.get("/", (req: Request, res: Response) => {
    res.json({
      status: "success",
      message: "ERP API is running",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/admin", adminRoutes);

  return app;
};

export default createServer;
