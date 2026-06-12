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
  Allowed frontend URLs:
  - Local frontend for development
  - Netlify frontend for public users

  You can also update CLIENT_URL inside Render Environment Variables.
*/
const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173,https://meek-cannoli-450f96.netlify.app"
)
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    /*
      Allow requests without an Origin header:
      - Direct browser API testing
      - Postman
      - Server-to-server calls
    */
    if (!origin) {
      return callback(null, true);
    }

    /*
      Allow only trusted frontend URLs
    */
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
  Keep CORS middleware before all routes.
  This also handles browser preflight OPTIONS requests.
*/
app.use(cors(corsOptions));

/*
  Request parsing and logs
*/
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan("dev"));

/*
  General API rate limiter
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
  Authentication routes:
  - Register
  - Login
  - Current user profile
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
  Public routes:
  - Published novels
  - Published chapters
  - Approved comments
*/
app.use("/api", publicRoutes);

/*
  Reader routes:
  - Likes
  - Bookmarks
  - Submit comments
*/
app.use("/api", readerRoutes);

/*
  Admin routes:
  - Dashboard
  - Novels
  - Chapters
  - Readers
  - Comments
*/
app.use("/api/admin", adminRoutes);

/*
  Unknown API route handler
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
