import BillService from "../services/Bill.service.js";
import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js"
import PayOS from "@payos/node";
import * as dotenv from 'dotenv'
dotenv.config();
const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECK_SUM_KEY } = process.env;
const payos = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECK_SUM_KEY);

const BillController = {
    getDebtOfRoom: asyncHandler(async(req,res)=> {
        try {
            const debt = await BillService.getDebtOfRoom(req);
            if (debt) return res.status(200).json(response.successResponse(200,debt));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    addBillInRoom: asyncHandler(async(req,res)=> {
        try {
            const bill = await BillService.addBillInRoom(req);
            if (bill) return res.status(201).json(response.successResponse(201,bill));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getBill: asyncHandler(async(req,res)=> {
        try {
            const bill = await BillService.getBill(req);
            if (bill) return res.status(200).json(response.successResponse(200,bill));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getBills: asyncHandler(async(req,res)=> {
        try {
            const bills = await BillService.getBills(req);
            if (bills) return res.status(200).json(response.successResponse(200,bills));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    confirmBills: asyncHandler(async(req,res)=> {
        try {
            const bills = await BillService.confirmBills(req);
            if (bills) return res.status(200).json(response.successResponse(200,bills));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    })
}

export default BillController