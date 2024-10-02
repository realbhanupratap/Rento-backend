import express from "express";
import { 
  grantInventoryAccess, 
  revokeInventoryAccess, 
  getTenantInventoryAccess, 
  getAllTenantInventoryAccessHistory 
} from "../controllers/inventoryAccess.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";  // Tenant authentication middleware
import { landlordAuthMiddleware } from "../middlewares/landlordAuth.middleware.js";  // Landlord middleware for access management

const router = express.Router();

router.use(authMiddleware);


// Grant inventory access (landlord)
router.post("/", landlordAuthMiddleware, grantInventoryAccess);

// Revoke inventory access (landlord)
router.put("/:id/revoke", landlordAuthMiddleware, revokeInventoryAccess);

// Get tenant's active inventory access (tenant)
router.get("/tenant/:tenantId/active", authMiddleware, getTenantInventoryAccess);

// Get tenant's full inventory access history (tenant)
router.get("/tenant/:tenantId/history", authMiddleware, getAllTenantInventoryAccessHistory);

export default router;
