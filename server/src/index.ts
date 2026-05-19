import * as dotenv from "dotenv";

import "./workers/emailWorker.js";

import express, { Request, Response } from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";

import { asyncHandler } from "./lib/asyncHandler.js";
import { ApiResponse } from "./lib/ApiResponse.js";
import { ApiError } from "./lib/ApiError.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

import { typeDefs } from "./graphql/schema/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import uploadFileToS3 from "./utils/aws/upload-file-to-s3.js";
import multer from "multer";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  // Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  // GraphQL Route
  app.use(
    "/graphql",
    expressMiddleware(apolloServer)
  );

  // REST Routes
  app.get("/", asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, { server: "running" }, "Server is running"));
  }));

  const upload = multer({ storage: multer.memoryStorage() });

  app.post("/upload-file", upload.array("files"), asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, { success: false }, "At least one file is required")
      );
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const url = await uploadFileToS3(file.buffer, file.originalname);
        return { url };
      })
    );

    return res.status(200).json(new ApiResponse(200, { success: true, urls: uploadResults }, "File uploaded successfully"));
  }))

  app.get("/error", asyncHandler(async (req: Request, res: Response) => {
    throw new ApiError(500, "Internal server error", [{ message: "checking for error api" }]);
  }));



  // Global Error Middleware
  app.use(errorMiddleware);

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
    console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
  });

};

startServer();