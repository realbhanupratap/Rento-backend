import { asyncHandler } from "../utils/asyncHandler.js";
import { Complaint } from "../models/complaints.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tenant } from "../models/tenant.models.js";
import { PropertyListing } from "../models/propertyListing.models.js";

// Submit a complaint
export const submitComplaint = asyncHandler(async (req, res) => {
  const { message, propertyId, priority } = req.body;

  if (!message || !propertyId) {
    throw new ApiError("Message and Property ID are required", 400);
  }

  // Find tenant (Assuming authenticated tenant's ID is in req.user)
  const tenant = await Tenant.findById(req.user._id);
  if (!tenant) {
    throw new ApiError("Tenant not found", 404);
  }

  // Check if the property exists
  const property = await PropertyListing.findById(propertyId);
  if (!property) {
    throw new ApiError("Property not found", 404);
  }

  // Create a complaint
  const complaint = await Complaint.create({
    tenant: tenant._id,
    property: property._id,
    message: message.trim(),
    priority: priority || 'Low', // Default priority to Low
  });

  return res.status(201).json(new ApiResponse(201, complaint, "Complaint submitted successfully"));
});

// Get complaint status by ID
export const getComplaintStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const complaint = await Complaint.findById(id)
    .populate('tenant', 'username email')
    .populate('property', 'address');

  if (!complaint) {
    throw new ApiError("Complaint not found", 404);
  }

  return res.status(200).json(new ApiResponse(200, complaint, "Complaint status retrieved successfully"));
});

// Update complaint status (for landlord/admin)
export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw new ApiError("Complaint not found", 404);
  }

  if (!['Submitted', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
    throw new ApiError("Invalid status", 400);
  }

  // If rejecting, require a reason
  if (status === 'Rejected' && !rejectionReason?.trim()) {
    throw new ApiError("Rejection reason is required", 400);
  }

  complaint.status = status;
  complaint.rejectionReason = status === 'Rejected' ? rejectionReason.trim() : "";
  await complaint.save();

  return res.status(200).json(new ApiResponse(200, complaint, "Complaint status updated successfully"));
});

// List all complaints for a tenant
export const listTenantComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ tenant: req.user._id })
    .populate('property', 'address');

  if (!complaints.length) {
    throw new ApiError("No complaints found for this tenant", 404);
  }

  return res.status(200).json(new ApiResponse(200, complaints, "Complaints retrieved successfully"));
});


export { 
  submitComplaint, 
  getComplaintStatus, 
  updateComplaintStatus, 
  listTenantComplaints 
};