import express from "express";
import { makeRentPayment, getPaymentHistory } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(authMiddleware);


// Route for getting the payment history (tenant must be authenticated)
router.post("/", authMiddleware, getPaymentHistory);

router.post("/rent", makeRentPayment);
router.get("/history", getPaymentHistory);

export default router;
