import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { InventoryAccess } from "../models/inventoryAccess.models.js";
import { Inventory } from "../models/inventory.models.js";
import { Tenant } from "../models/tenant.models.js";

// Grant access to inventory item
export const grantInventoryAccess = asyncHandler(async (req, res) => {
  const { tenantId, inventoryItemId, accessStartDate, accessEndDate } = req.body;

  // Validate the request data
  if (!tenantId || !inventoryItemId || !accessStartDate) {
    throw new ApiError("Tenant, inventory item, and access start date are required", 400);
  }

  // Find the tenant
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) {
    throw new ApiError("Tenant not found", 404);
  }

  // Find the inventory item
  const inventoryItem = await Inventory.findById(inventoryItemId);
  if (!inventoryItem) {
    throw new ApiError("Inventory item not found", 404);
  }

  // Create the inventory access record
  const inventoryAccess = await InventoryAccess.create({
    tenant: tenant._id,
    inventoryItem: inventoryItem._id,
    accessStartDate: new Date(accessStartDate),
    accessEndDate: accessEndDate ? new Date(accessEndDate) : null,
  });

  return res.status(201).json(
    new ApiResponse(201, inventoryAccess, "Inventory access granted successfully")
  );
});

// Revoke inventory access
export const revokeInventoryAccess = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the inventory access record
  const inventoryAccess = await InventoryAccess.findById(id);
  if (!inventoryAccess) {
    throw new ApiError("Inventory access record not found", 404);
  }

  // Set the end date to now to revoke access
  inventoryAccess.accessEndDate = new Date();
  await inventoryAccess.save();

  return res.status(200).json(
    new ApiResponse(200, inventoryAccess, "Inventory access revoked successfully")
  );
});

// Get tenant's current inventory access
export const getTenantInventoryAccess = asyncHandler(async (req, res) => {
  const { tenantId } = req.params;

  // Find all active inventory accesses for the tenant
  const inventoryAccesses = await InventoryAccess.find({
    tenant: tenantId,
    accessEndDate: { $exists: false },  // Find active access only
  }).populate('inventoryItem', 'name description');

  if (!inventoryAccesses.length) {
    throw new ApiError("No active inventory access found for this tenant", 404);
  }

  return res.status(200).json(
    new ApiResponse(200, inventoryAccesses, "Tenant's current inventory access retrieved successfully")
  );
});

// Get all inventory access history
export const getAllTenantInventoryAccessHistory = asyncHandler(async (req, res) => {
  const { tenantId } = req.params;

  // Find all inventory accesses (both active and ended)
  const inventoryAccessHistory = await InventoryAccess.find({ tenant: tenantId })
    .populate('inventoryItem', 'name description');

  if (!inventoryAccessHistory.length) {
    throw new ApiError("No inventory access history found for this tenant", 404);
  }

  return res.status(200).json(
    new ApiResponse(200, inventoryAccessHistory, "Tenant's inventory access history retrieved successfully")
  );
});


export { 
  grantInventoryAccess, 
  revokeInventoryAccess, 
  getTenantInventoryAccess, 
  getAllTenantInventoryAccessHistory 
};
