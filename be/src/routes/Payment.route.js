import express from "express";
import PaymentController from '../controllers/Payment.controller.js';


const paymentRoute = express.Router();

paymentRoute.post("/", PaymentController.createPaymentLink)
paymentRoute.post("/:paymentLinkId/cancel",PaymentController.cancelPaymentLink)
paymentRoute.get("/:paymentLinkId", PaymentController.getPaymentLink)


export default paymentRoute