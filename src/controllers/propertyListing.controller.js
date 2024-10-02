import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PropertyListing } from "../models/propertyListing.models.js";

// Get all available properties for rent
export const getAvailableProperties = asyncHandler(async (req, res) => {
  const { amenities, propertyType } = req.query; // Optional filter by amenities and property type

  // Find all available properties
  let query = { available: true };

  // If amenities are provided, filter by those amenities
  if (amenities) {
    query.amenities = { $all: amenities.split(',') };  // Example: ?amenities=Wi-Fi,Parking
  }

  // If property type is provided, filter by property type
  if (propertyType) {
    query.propertyType = propertyType;
  }

  const properties = await PropertyListing.find(query).populate('reviews');
  if (!properties.length) {
    throw new ApiError('No available properties found', 404);
  }

  return res.status(200).json(
    new ApiResponse(200, properties, 'Available properties retrieved successfully')
  );
});

// Rent a property
export const rentProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const tenantId = req.user._id;

  // Find the property
  const property = await PropertyListing.findById(propertyId);
  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  // Check if the property is available
  if (!property.available) {
    throw new ApiError('Property is not available for rent', 400);
  }

  // Update the property as rented
  property.available = false;
  await property.save();

  // Logic to associate the property with the tenant would be added here

  return res.status(200).json(
    new ApiResponse(200, property, 'Property rented successfully')
  );
});

// View property details
export const viewProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the property by its ID and populate reviews
  const property = await PropertyListing.findById(id).populate('reviews');
  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  return res.status(200).json(
    new ApiResponse(200, property, 'Property details retrieved successfully')
  );
});

// Add a new property (Landlord)
export const addProperty = asyncHandler(async (req, res) => {
  const { propertyName, location, coordinates, amenities, description, photos } = req.body;
  const landlordId = req.user._id;

  // Validate the request data
  if (!propertyName || !location || !coordinates) {
    throw new ApiError('Property name, location, and coordinates are required', 400);
  }

  // Create the property listing
  const newProperty = await PropertyListing.create({
    landlord: landlordId,
    propertyName,
    location,
    coordinates,
    amenities,
    description,
    photos,
  });

  return res.status(201).json(
    new ApiResponse(201, newProperty, 'Property listed successfully')
  );
});

// Update property details (Landlord)
export const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { propertyName, location, amenities, description, photos, available, coordinates } = req.body;

  // Find the property by ID
  const property = await PropertyListing.findById(id);
  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  // Update the property details
  if (propertyName) property.propertyName = propertyName;
  if (location) property.location = location;
  if (coordinates) property.coordinates = coordinates;
  if (amenities) property.amenities = amenities;
  if (description) property.description = description;
  if (photos) property.photos = photos;
  if (available !== undefined) property.available = available;

  await property.save();

  return res.status(200).json(
    new ApiResponse(200, property, 'Property updated successfully')
  );
});

// Get properties near tenant's location
export const getPropertiesNearLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude, maxDistance = 5000 } = req.query; // maxDistance is in meters

  if (!latitude || !longitude) {
    throw new ApiError('Latitude and longitude are required', 400);
  }

  // Find properties near the provided location using MongoDB's geospatial query
  const properties = await PropertyListing.find({
    available: true,
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)], // Ensure they're numbers
        },
        $maxDistance: parseInt(maxDistance), // maxDistance in meters
      }
    }
  });

  if (!properties.length) {
    throw new ApiError('No properties found near this location', 404);
  }

  return res.status(200).json(
    new ApiResponse(200, properties, 'Properties near location retrieved successfully')
  );
});

export { 
  getAvailableProperties, 
  getPropertiesNearLocation,
  rentProperty, 
  viewProperty, 
  addProperty, 
  updateProperty 
};
