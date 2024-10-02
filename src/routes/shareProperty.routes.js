import express from "express";
import { shareProperty } from "../controllers/share.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // Ensure the user is authenticated

const router = express.Router();

router.use(authMiddleware);


router.post("/share", authMiddleware, shareProperty); // Protect the route with authMiddleware

export default router;
