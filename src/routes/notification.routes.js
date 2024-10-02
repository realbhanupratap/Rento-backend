import express from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(authMiddleware);


router.get("/:userId/:userType", getNotifications);
router.patch("/:notificationId/read", markNotificationAsRead);

export default router;
