import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.APP_URL ?? ""]
        : "http://localhost:8080",
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

export default app;
