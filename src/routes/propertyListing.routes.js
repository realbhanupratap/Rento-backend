import express from "express";
import { 
  getAvailableProperties, 
  rentProperty, 
  viewProperty, 
  addProperty, 
  updateProperty,
  getPropertiesNearLocation
} from "../controllers/propertyListing.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.use(authMiddleware);


// Get all available properties (tenant/guest)
router.get("/available", getAvailableProperties);

// Rent a property (tenant)
router.post("/:propertyId/rent", authMiddleware, rentProperty);

// View property details (tenant/guest)
router.get("/:id", viewProperty);

// Add a property (landlord)
router.post("/", authMiddleware, addProperty);

// Update a property (landlord)
router.put("/:id", authMiddleware, updateProperty);

// Get properties near a location (tenant)
router.get("/nearby", getPropertiesNearLocation);

export default router;