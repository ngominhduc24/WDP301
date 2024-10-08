import AccountModel from "../models/Account.model.js";
import BillsModel from "../models/Bills.model.js";
import Notification from "../models/Notification.model.js";
import RoomsModel from "../models/Rooms.model.js";
import getCurrentUser from "../utils/getCurrentUser.js";
import PayOS from "@payos/node";
import * as dotenv from "dotenv";
dotenv.config();
const { CLIENT_URL } = process.env;

const BillService = {
    getDebtOfRoom: async (req) => {
        const { roomId } = req.params;
        const oldBill = await BillsModel.find({ roomId, isPaid: false });

        const listDebt = [];
        oldBill.map((bill) => {
            listDebt.push(bill.total);
        });
        let debt = 0;
        if (listDebt.length > 0) {
            debt = listDebt.reduce((debt, item) => {
                return debt + item;
            });
        }
        return {
            debt: 0
        }
        
    },
    addBillInRoom: async (req) => {
        try {
            const { roomId } = req.params;
            const currentUserId = getCurrentUser(req);
            const room = await RoomsModel.findById(roomId).populate({
                path: "houseId",
                populate: { path: "priceList", populate: "base" },
            });
            if (room.members.length === 0) {
                throw new Error(
                    "Phòng " +
                        room.name +
                        " chưa có người ở không thể tạo hoá đơn"
                );
            }

            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            const existingBill = await BillsModel.findOne({
                roomId,
                createdAt: {
                    $gte: new Date(thisYear, thisMonth, 1), // Ngày đầu tiên của tháng này
                    $lt: new Date(thisYear, thisMonth + 1, 1), // Ngày đầu tiên của tháng sau
                },
            });

            if (existingBill) {
                throw new Error(
                    "Hóa đơn cho phòng này trong tháng này đã tồn tại."
                );
            }

            const { priceList, note } = req.body;
            const oldBill = await BillsModel.find({ roomId, isPaid: false });
            const listDebt = [];
            oldBill.map((bill) => {
                listDebt.push(bill.total);
            });
            let debt = 0;
            if (listDebt.length > 0) {
                debt = listDebt.reduce((debt, item) => {
                    return debt + item;
                });
            }

            let priceListForBill = [];
            priceList.map((item) => {
                if (item.startUnit > item.endUnit) {
                    throw new Error("Chỉ số đầu không thể lớn hơn chỉ số cuối");
                }
                if (item.base.unit === "đồng/tháng") {
                    priceListForBill.push({
                        base: item.base._id,
                        unitPrice: item.unitPrice,
                        startUnit: item.startUnit,
                        endUnit: item.endUnit,
                        totalUnit: item.unitPrice,
                    });
                } else if (item.base.unit === "đồng/kWh") {
                    priceListForBill.push({
                        base: item.base._id,
                        unitPrice: item.unitPrice,
                        startUnit: item.startUnit,
                        endUnit: item.endUnit,
                        totalUnit:
                            (item.endUnit - item.startUnit) * item.unitPrice,
                    });
                } else if (item.base.unit === "đồng/khối") {
                    priceListForBill.push({
                        base: item.base._id,
                        unitPrice: item.unitPrice,
                        startUnit: item.startUnit,
                        endUnit: item.endUnit,
                        totalUnit:
                            (item.endUnit - item.startUnit) * item.unitPrice,
                    });
                } else if (item.base.unit === "đồng/người") {
                    priceListForBill.push({
                        base: item.base._id,
                        unitPrice: item.unitPrice,
                        startUnit: item.startUnit,
                        endUnit: item.endUnit,
                        totalUnit: item.unitPrice * room.members.length,
                    });
                }
            });
            const totalUnits = priceListForBill.reduce((total, item) => {
                return total + item.totalUnit;
            }, 0);
            const bill = new BillsModel({
                roomId,
                roomPrice: room.roomPrice,
                priceList: priceListForBill,
                debt: debt,
                total: room.roomPrice + totalUnits + debt,
                note,
                houseId: room.houseId._id,
            });
            await bill.save();

            const account = await AccountModel.findById(currentUserId);
            let paymentLink;
            if (
                account.payosClientId &&
                account.payosAPIKey &&
                account.payosCheckSum
            ) {
                const payos = new PayOS(
                    account.payosClientId,
                    account.payosAPIKey,
                    account.payosCheckSum
                );
                const orderCode = Date.now();
                const requestData = {
                    orderCode: Number(orderCode),
                    amount: room.roomPrice + totalUnits + debt,
                    // amount: 10000,
                    description: "Thanh toán tiền phòng" + room.name,
                    cancelUrl: "http://localhost:5173/" + bill.id,
                    returnUrl: "http://localhost:5173/billsuccess/" + bill.id,
                };
                try {
                    paymentLink = await payos.createPaymentLink(requestData);
                } catch (error) {
                    await BillsModel.findByIdAndDelete(bill.id);
                    throw new Error("Thông tin ngân hàng không hợp lệ");
                }
            } else {
                await BillsModel.findByIdAndDelete(bill.id);
                throw new Error("Thêm thông tin ngân hàng để tạo hoá đơn");
            }
            bill.paymentLink = paymentLink;
            await bill.save();
            const roomAccount = await AccountModel.findOne({ roomId: roomId });
            await Notification.create({
                sender: getCurrentUser(req),
                recipients: [
                    {
                        user: roomAccount.id,
                        isRead: false,
                    },
                ],
                message: "Một hoá đơn phòng" + room.name + "đã được tạo",
                type: "bill",
                link: CLIENT_URL + "/bill/" + bill.id,
            });

            return {
                bill: bill._doc,
                paymentLink,
            };
        } catch (error) {
            throw error;
        }
    },
    getBill: async (req) => {
        try {
            const { billId } = req.params;
            const bill = await BillsModel.findById(billId)
                .populate({ path: "roomId", select: "name" })
                .populate("priceList.base");
            return bill;
        } catch (error) {
            throw error;
        }
    },
    getBills: async (req) => {
        try {
            const { roomId, option, houseId } = req.query;
            let data;
            const query = {};
            if (roomId) {
                query.roomId = roomId;
            }
            if (houseId) {
                query.houseId = houseId;
            }
            if (String(option) === "all") {
                data = await BillsModel.find({})
                    .populate({ path: "roomId", select: "name" })
                    .populate("priceList.base")
                    .sort({ createdAt: -1 });
            } else {
                data = await BillsModel.find(query)
                    .populate({ path: "roomId", select: "name" })
                    .populate("priceList.base")
                    .sort({ createdAt: -1 });
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    confirmBills: async (req) => {
        try {
            const { billId } = req.params;
            const {paymentMethod} = req.body;
            const bill = await BillsModel.findById(billId)
                .populate({ path: "roomId", select: "name" })
                .populate("priceList.base");
            if (bill.isPaid) {
                return { message: "Bill đã thanh toán rồi !!" };
            } else {
                bill.isPaid = true;
                bill.paymentMethod = paymentMethod;
            }
            await bill.save();
            const roomAccount = await AccountModel.findOne({ roomId: bill.roomId });
            await Notification.create({
                sender: getCurrentUser(req),
                recipients: [
                    {
                        user: roomAccount.id,
                        isRead: false,
                    },
                ],
                message: "Hoá đơn đã được xác nhận thanh toán bằng " + (paymentMethod === "Cash" ? " Tiền mặt" :(paymentMethod === "Banking" ? "Chuyển khoản": "") ),
                type: "bill",
                link: CLIENT_URL + "/bill/" + bill.id,
            });
            return bill;
        } catch (error) {
            throw error;
        }
    }
};
export default BillService;
