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

/*
  Security middleware
*/
app.use(helmet());

/*
  Always allow:
  - Local React frontend
  - Public Netlify frontend

  Also include any additional URLs from the Render CLIENT_URL variable.
*/
const defaultOrigins = [
  "http://localhost:5173",
  "https://meek-cannoli-450f96.netlify.app"
];

const environmentOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...environmentOrigins])];

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin(origin, callback) {
    /*
      Allow direct browser URL tests, Postman requests,
      and server-to-server requests without an Origin header.
    */
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(`CORS blocked for origin: ${origin}`);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"]
};

/*
  Keep CORS before every API route.
*/
app.use(cors(corsOptions));

/*
  Request parsing and logging
*/
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan("dev"));

/*
  General API rate limit
*/
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", apiLimiter);

/*
  Public health route
*/
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Novel Threads API is running"
  });
});

/*
  Authentication routes
*/
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 40,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many login attempts. Please try again later."
    }
  }),
  authRoutes
);

/*
  Public reader routes
*/
app.use("/api", publicRoutes);

/*
  Protected reader routes
*/
app.use("/api", readerRoutes);

/*
  Protected admin routes
*/
app.use("/api/admin", adminRoutes);

/*
  Unknown API route
*/
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

/*
  Global error handler
*/
app.use((err, req, res, next) => {
  console.error(err);

  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: "This website is not allowed to access the API"
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value already exists"
    });
  }

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" ? "Server error" : err.message
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
