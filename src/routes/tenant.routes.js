import express from "express";
import { 
  registerTenant, 
  loginTenant, 
  refreshToken, 
  logoutTenant, 
  getTenantProfile, 
  changePassword 
} from "../controllers/tenantAuth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // Assuming this middleware verifies tokens

const router = express.Router();

// Public routes
router.post("/register", registerTenant);
router.post("/login", loginTenant);
router.post("/refresh-token", refreshToken);

// Protected routes
router.use(verifyToken);  // Applies `verifyToken` middleware to all routes below

router.post("/logout", logoutTenant);
router.put("/change-password", changePassword);  // Use `PUT` for updating password
router.get("/profile", getTenantProfile);

export default router;
