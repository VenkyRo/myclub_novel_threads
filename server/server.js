import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import readerRoutes from "./routes/readerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

await connectDB();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(mongoSanitize());
app.use(morgan("dev"));

/*
  Public health route:
  Keep this before protected reader and admin routes.
*/
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Novel Threads API is running",
  });
});

/*
  Authentication routes:
  Register and login are public.
  /api/auth/me requires a login token.
*/
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 40,
  }),
  authRoutes
);

/*
  Public routes:
  Published novels, chapters, and approved comments.
*/
app.use("/api", publicRoutes);

/*
  Protected reader routes:
  Likes, bookmarks, and new comments.
*/
app.use("/api", readerRoutes);

/*
  Protected admin routes.
*/
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.code === 11000 ? 409 : 500).json({
    success: false,
    message:
      err.code === 11000
        ? "Duplicate value already exists"
        : process.env.NODE_ENV === "production"
          ? "Server error"
          : err.message,
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});