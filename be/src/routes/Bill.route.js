import express from 'express'
import BillController from '../controllers/Bill.controller.js';

const billRoute = express.Router();
billRoute.get("/",BillController.getBills);
billRoute.get("/debt/room/:roomId",BillController.getDebtOfRoom)
billRoute.post("/room/:roomId",BillController.addBillInRoom)
billRoute.get("/:billId",BillController.getBill);
billRoute.post("/:billId",BillController.confirmBills);



export default billRoute