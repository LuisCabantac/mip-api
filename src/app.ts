import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";

import authRoute from "./routes/auth";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.APP_URL ?? ""]
        : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.json({
    message: "mIP API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/login", authRoute);

export default app;
