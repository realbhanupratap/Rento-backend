import { asyncHandler } from "../utils/asyncHandler.js";
import { ShareProperty } from "../models/shareProperty.models.js";
import { PropertyListing } from "../models/propertyListing.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Share property details on social media or via email
export const shareProperty = asyncHandler(async (req, res) => {
  const { propertyId, platform } = req.body;
  const tenantId = req.user._id;

  // Validate the platform
  const allowedPlatforms = ['Facebook', 'Twitter', 'Instagram', 'Email', 'WhatsApp'];
  if (!allowedPlatforms.includes(platform)) {
    throw new ApiError('Invalid sharing platform', 400);
  }

  // Check if the property exists
  const property = await PropertyListing.findById(propertyId);
  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  // Record the share action
  const sharedProperty = await ShareProperty.create({
    tenant: tenantId,
    property: propertyId,
    platform,
  });

  // Logic to actually share the property on the given platform could go here
  // For example, generating a shareable link, sending an email, etc.

  return res.status(201).json(
    new ApiResponse(201, sharedProperty, 'Property shared successfully')
  );
});

export { shareProperty };