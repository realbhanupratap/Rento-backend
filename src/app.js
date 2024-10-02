import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Importing middlewares
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware.js"; // Import rate limit middleware
import { validationMiddleware } from "./middlewares/validation.middleware.js"; // Import validation middleware

const app = express();

// CORS setup
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Global middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Logging middleware (applied globally)
app.use(loggerMiddleware);

// Apply rate limiting middleware globally
app.use(rateLimitMiddleware);

// Auth middleware (you can apply globally or route-specific)
app.use(authMiddleware);

// Routes import
import tenant from './routes/tenant.routes.js';
import complaints from './routes/complaints.routes.js';
import paymentHistory from './routes/paymentHistory.routes.js';
import propertyListing from './routes/propertyListing.routes.js';
import shareProperty from './routes/shareProperty.routes.js';
import getReviewsForProperty from './routes/reviews.routes.js';
import notificationRoutes from './routes/notification.routes.js'; // Notifications

// Routes declaration
app.use("/api/v1/tenant", tenant);
app.use("/api/v1/complaints", complaints);
app.use("/api/v1/paymenthistory", paymentHistory);
app.use("/api/v1/properylisting", propertyListing);
app.use("/api/v1/shareproperty", shareProperty);
app.use("/api/v1/reviewproperty", getReviewsForProperty);
app.use("/api/v1/notifications", notificationRoutes); // For Notifications

// Validation middleware for specific routes (e.g., property listing)
app.use("/api/v1/properylisting", validationMiddleware); // Apply validation on specific routes

// Error handling middleware (place this after all routes)
app.use(errorMiddleware);

// Export the app
export { app };
