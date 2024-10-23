import getCurrentUser from "../utils/getCurrentUser.js";
import HousesModel from "../models/Houses.model.js";
import RoomsModel from "../models/Rooms.model.js";
import BillsModel from "../models/Bills.model.js";
import ProblemsModel from "../models/Problems.model.js";

const statisticsService = {
  statisticGeneral: async (req) => {
    try {
      const currentUserId = getCurrentUser(req);

      let query = { deleted: false };
            if (req.user.accountType === 'host') {
                query.hostId = currentUserId;
            }
      const houses = await HousesModel.find(query);
      const houseNumber = houses.length;

      let roomNumber = 0;
      let roomNumberEmpty = 0;

      for (const house of houses) {
        const rooms = await RoomsModel.find({
          houseId: house.id,
          deleted: false,
        });
        roomNumber += rooms.length;
        const count = await RoomsModel.countDocuments({
          houseId: house.id,
          deleted: false,
          "members.0": { $exists: false },
        });
        roomNumberEmpty += count;
      }

      return {
        houseNumber: houseNumber,
        roomNumber: roomNumber,
        roomNumberNotEmpty: roomNumber - roomNumberEmpty,
        roomNumberEmpty: roomNumberEmpty,
      };
    } catch (error) {
      throw error;
    }
  },
  statisticAllBills: async (req) => {
    try {
      const currentUserId = getCurrentUser(req);
      const { month } = req.query;

      let query = { deleted: false };
        if (req.user.accountType === 'host') {
            query.hostId = currentUserId;
      }

      const houses = await HousesModel.find(query);
      
      let billIsPaid = 0;
      let totalBillIsPaid = 0;
      let billIsNotPaid = 0;
      let totalBillIsNotPaid = 0;
      if (month) {
        const [mm, yyyy] = month.split("-");
        const startOfMonth = new Date(yyyy, mm - 1, 1);
        const endOfMonth = new Date(yyyy, mm, 0);
        for (const house of houses) {
          const bills = await BillsModel.find({
            houseId: house.id,
            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
          });
          for (const bill of bills) {
            if (bill.isPaid === true) {
              billIsPaid += 1;
              totalBillIsPaid += bill.total;
            } else {
              billIsNotPaid += 1;
              totalBillIsNotPaid += bill.total;
            }
          }
        }
      } else {
        for (const house of houses) {
          const bills = await BillsModel.find({ houseId: house.id });
          for (const bill of bills) {
            if (bill.isPaid === true) {
              billIsPaid += 1;
              totalBillIsPaid += bill.total;
            } else {
              billIsNotPaid += 1;
              totalBillIsNotPaid += bill.total;
            }
          }
        }
      }
      return {
        billIsPaid,
        billIsNotPaid,
        totalBillIsPaid,
        totalBillIsNotPaid,
      };
    } catch (error) {}
  },
  async updateProduct(productId, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true }
      );
      if (!updatedProduct) {
        throw new Error("Product not found");
      }
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  },
  statisticProblem: async (req) => {
    try {
      const currentUserId = getCurrentUser(req);
      const { month } = req.query;

      let query = { deleted: false };
        if (req.user.accountType === 'host') {
            query.hostId = currentUserId;
      }
      const houses = await HousesModel.find(query);

      let numberProblemNone = 0;
      let numberProblemDoing = 0;
      let numberProblemDone = 0;
      if (month) {
        const [mm, yyyy] = month.split("-");
        const startOfMonth = new Date(yyyy, mm - 1, 1);
        const endOfMonth = new Date(yyyy, mm, 0);
        for (const house of houses) {
          numberProblemNone += await ProblemsModel.countDocuments({
            houseId: house.id,
            status: "none",
            deleted: false,
            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
          });
          numberProblemDoing += await ProblemsModel.countDocuments({
            houseId: house.id,
            status: "doing",
            deleted: false,
            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
          });
          numberProblemDone += await ProblemsModel.countDocuments({
            houseId: house.id,
            status: "done",
            deleted: false,
            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
          });
        }
      } else {
        for (const house of houses) {
          numberProblemNone += await ProblemsModel.countDocuments({
            houseId: house.id,
            status: "none",
            deleted: false,
          });
          numberProblemDoing += await ProblemsModel.countDocuments({
            houseId: house.id,
            status: "doing",
            deleted: false,
          });
          numberProblemDone += await ProblemsModel.countDocuments({
            houseId: house.id,
            status: "done",
            deleted: false,
          });
        }
      }
      return {
        numberProblemNone,
        numberProblemDoing,
        numberProblemDone,
      };
    } catch (error) {}
  },
  statisticRevenue: async (req) => {
    const currentUserId = getCurrentUser(req);
    
    let query = { deleted: false };
        if (req.user.accountType === 'host') {
            query.hostId = currentUserId;
      }
      const houses = await HousesModel.find(query);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const revenueByMonth = {};

    for (let i = 1; i <= 12; i++) {
      revenueByMonth[`${i}`] = 0;
    }
    for (const house of houses) {
      const bills = await BillsModel.find({
        houseId: house.id,
        isPaid: true,
        createdAt: {
          $gte: new Date(currentYear, 0), // Bắt đầu từ đầu năm hiện tại
          $lte: currentDate, // Đến thời điểm hiện tại
        },
      });
      for (const bill of bills) {
        const createdAt = bill.createdAt;
        const month = createdAt.getMonth() + 1;
        const year = createdAt.getFullYear();
        const key = `${month}`;

        revenueByMonth[key] += bill.total; // Tổng hợp số tiền từ mỗi hóa đơn
      }
    }
    return {
      year: currentYear,
      revenueByMonth,
    };
  },
};

export default statisticsService;
