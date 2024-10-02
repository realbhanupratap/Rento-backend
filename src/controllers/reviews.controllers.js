import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/reviews.models.js";
import { PropertyListing } from "../models/propertyListing.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Add a new review
export const addReview = asyncHandler(async (req, res) => {
  const { propertyId, rating, comment } = req.body;
  const tenantId = req.user._id;

  // Check if the property exists
  const property = await PropertyListing.findById(propertyId);
  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  // Check if the tenant has already reviewed this property
  const existingReview = await Review.findOne({ tenant: tenantId, property: propertyId });
  if (existingReview) {
    throw new ApiError('You have already reviewed this property', 400);
  }

  // Create a new review
  const review = await Review.create({
    tenant: tenantId,
    property: propertyId,
    rating,
    comment,
  });

  return res.status(201).json(
    new ApiResponse(201, review, 'Review added successfully')
  );
});

// Update a review
export const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const tenantId = req.user._id;

  // Find the review
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  // Ensure the tenant updating the review is the one who created it
  if (review.tenant.toString() !== tenantId.toString()) {
    throw new ApiError('Unauthorized to update this review', 403);
  }

  // Update review details
  review.rating = rating !== undefined ? rating : review.rating;
  review.comment = comment !== undefined ? comment : review.comment;

  await review.save();

  return res.status(200).json(
    new ApiResponse(200, review, 'Review updated successfully')
  );
});

// Get reviews for a property
export const getReviewsForProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  // Find reviews for the property
  const reviews = await Review.find({ property: propertyId }).populate('tenant', 'name');

  return res.status(200).json(
    new ApiResponse(200, reviews, 'Reviews fetched successfully')
  );
});

// Delete a review
export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const tenantId = req.user._id;

  // Find the review
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  // Ensure the tenant deleting the review is the one who created it
  if (review.tenant.toString() !== tenantId.toString()) {
    throw new ApiError('Unauthorized to delete this review', 403);
  }

  await review.remove();

  return res.status(200).json(
    new ApiResponse(200, null, 'Review deleted successfully')
  );
});

export {
  addReview,
  updateReview,
  getReviewsForProperty,
  deleteReview
};