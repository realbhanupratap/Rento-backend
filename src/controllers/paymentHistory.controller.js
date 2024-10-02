import { asyncHandler } from "../utils/asyncHandler";
import { Payment } from "../models/paymentHistory.models.js";

// Make rent payment
export const makeRentPayment = asyncHandler(async (req, res) => {
  const { amount, propertyId } = req.body;
  // Logic for rent payment (already discussed)...
});

// Get payment history
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const tenantId = req.user._id;
  const payments = await Payment.find({ tenant: tenantId });
  // Logic to return payment history...
});

export { makeRentPayment, getPaymentHistory };