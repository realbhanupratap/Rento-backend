import express from "express";
import {
  addReview,
  updateReview,
  getReviewsForProperty,
  deleteReview
} from "../controllers/reviews.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // Ensure user is authenticated

const router = express.Router();

router.use(authMiddleware);

// Route for adding a new review (tenant must be authenticated)
router.post("/", authMiddleware, addReview);

// Route for updating an existing review (tenant must be authenticated)
router.put("/:reviewId", authMiddleware, updateReview);

// Route for getting all reviews for a specific property (public route)
router.get("/:propertyId", getReviewsForProperty);

// Route for deleting a review (tenant must be authenticated)
router.delete("/:reviewId", authMiddleware, deleteReview);

export default router;
