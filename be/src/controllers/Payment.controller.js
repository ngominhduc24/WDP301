import PaymentService from "../services/Payment.Service.js";
import asyncHandler from "../utils/async-handler.js";
import response from "../utils/response.js";
import PayOS from "@payos/node";
import * as dotenv from "dotenv";
dotenv.config();
const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECK_SUM_KEY } = process.env;

const PaymentController = {
    createPaymentLink: asyncHandler(async (req, res) => {
        try {
            const payment = await PaymentService.createPaymentLink(req);
            if (payment)
                return res
                    .status(201)
                    .json(response.successResponse(201, payment));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res
                .status(500)
                .json(response.errorResponse(500, error.toString()));
        }
    }),
    getPaymentLink: asyncHandler(async (req, res) => {
        try {
            const payment = await PaymentService.getPaymentLink(req);
            if (payment)
                return res
                    .status(200)
                    .json(response.successResponse(200, payment));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res
                .status(500)
                .json(response.errorResponse(500, error.toString()));
        }
    }),
    cancelPaymentLink: asyncHandler(async (req, res) => {
        try {
            const payment = await PaymentService.cancelPaymentLink(req);
            if (payment)
                return res
                    .status(200)
                    .json(response.successResponse(200, payment));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res
                .status(500)
                .json(response.errorResponse(500, error.toString()));
        }
    }),
};
export default PaymentController;
