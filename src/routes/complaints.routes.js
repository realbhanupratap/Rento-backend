import express from "express";
import { 
  submitComplaint, 
  getComplaintStatus, 
  updateComplaintStatus, 
  listTenantComplaints 
} from "../controllers/complaint.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // Assuming auth is required

const router = express.Router();

router.use(authMiddleware);

// Tenant submits a complaint
router.post("/", authMiddleware, submitComplaint);

// Tenant views their complaints
router.get("/tenant", authMiddleware, listTenantComplaints);

// Get the status of a specific complaint
router.get("/:id/status", authMiddleware, getComplaintStatus);

// Landlord/Admin updates complaint status
router.put("/:id/status", landlordAuthMiddleware, updateComplaintStatus);

export default router;
