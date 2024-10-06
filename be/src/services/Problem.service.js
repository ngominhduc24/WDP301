import AccountModel from "../models/Account.model.js";
import HousesModel from "../models/Houses.model.js";
import NewsModel from "../models/News.model.js";
import Notification from "../models/Notification.model.js";
import ProblemsModel from "../models/Problems.model.js";
import RoomsModel from "../models/Rooms.model.js";
import getCurrentUser from "../utils/getCurrentUser.js";
import getPaginationData from "../utils/getPaginationData.js";
import * as dotenv from 'dotenv'
dotenv.config();
const {CLIENT_URL} = process.env

const ProblemService = {
    addOne: async(req) => {
        try {
            const {roomId} = req.body;
            const room = await RoomsModel.findById(roomId).populate({path: "houseId",select: "hostId",populate: {path: "hostId",select: "_id"}});
            const creatorId = getCurrentUser(req);
            const data = await ProblemsModel.create({...req.body,creatorId,houseId:room.houseId});
            await room.save();
            const roomAccount = await AccountModel.findOne({roomId: roomId})
            await Notification.create({
                sender: getCurrentUser(req),
                recipients: [
                    {
                        user: room.houseId.hostId._id,                        
                    }
                ],
                message: "1 problem đã được thêm vào phòng " + room.name,
                type: "problem",
                link: CLIENT_URL + "/problem/" + data.id
            })
            return data;
        } catch (error) {
            throw error
        }
    },/*  */
    getInHouse: async (req) => {
        try {
            const {houseId} = req.params;
            const {page,limit} = req.query;
            const query = {houseId,deleted: false};
            const populateFields = ["roomId","creatorId"]
            const data = await getPaginationData(ProblemsModel,page,limit,query,populateFields);
            return data
        } catch (error) {
            throw error
            
        }
        
    },
    getByFilter: async(req) => {
        try {
            const {roomId} = req.params; 
            const {page,limit,type,status,title,content} = req.query;
            const query = {roomId,deleted: false};
            if (type) {
                query.type = type;
            }
            if (status){
                query.status = status;
            }
            if (title) {
                query.title = {$regex: title, $options: "i"};
            }
            if (content) {
                query.content = {$regex: content, $options: "i"}
            }
            const data = await getPaginationData(ProblemsModel,page,limit,query);
            return data;
        } catch (error) {
            throw error
        }

    },
    getInRoom: async(req) => {
        try {
            const {houseId} = req.params;
            const problems = ProblemsModel.find({houseId});
            return problems;
        } catch (error) {
            throw error
        }
    },
    getOne: async (req) => {
        try {
            const {problemId} = req.params;
            const data =  await ProblemsModel.findById(problemId).populate([{path: "creatorId"}, {path: "roomId"}]);
            return data;

        } catch (error) {
            throw error
        }
    },
    updateOne: async (req) => {
        try {
            const {problemId} = req.params;
            await ProblemsModel.findByIdAndUpdate(problemId,{...req.body});
            const newData = await ProblemsModel.findById(problemId);
            const roomAccount = await AccountModel.findOne({roomId: newData.roomId})
            const room = await RoomsModel.findById(newData.roomId)
            await Notification.create({
                sender: getCurrentUser(req),
                recipients: [
                    {
                        user: roomAccount,                        
                    }
                ],
                message: "Problem phòng " + room.name + " đã được cập nhật",
                type: "problem",
                link: CLIENT_URL + "/problem/" + newData.id
            })
            return newData
        } catch (error) {
            throw error
        }
    },
    deleteOne: async (req) => {
        try {
            const {problemId} = req.params;
            await ProblemsModel.findByIdAndUpdate(problemId,{deleted: true,deletedAt: Date.now()});
            const newData = await ProblemsModel.findById(problemId);
            return newData;
        } catch (error) {
            throw error
        }
    },
    resetProblem: async (req) => {
        try {
            await NewsModel.deleteMany({deleted:true})
            return "xoas thanhf coong"
        } catch (error) {
            throw error
        }
    }
    // resetProblem: async (req) => {
    //     try {
    //         const accounts = await AccountModel.find();
    
    //         for (const account of accounts) {
    //             const roomExists = await RoomsModel.exists({ _id: account.roomId });
    //             if (!roomExists) {
    //                 await AccountModel.deleteOne({ _id: account._id });
    //             }
    //         }
    
    //         return "Xoá thành công.";
    //     } catch (error) {
    //         throw error;
    //     }
    // },
    // resetProblem: async (req) => {
    //     try {
    //         const rooms = await RoomsModel.find();
    
    //         for (const room of rooms) {
    //             const houseExists = await HousesModel.exists({ _id: room.houseId });
    //             if (!houseExists) {
    //                 // Xoá phòng không có houseId tồn tại trong houseModel
    //                 await RoomsModel.deleteOne({ _id: room._id });
    //             }
    //         }
    
    //         return "Xoá thành công các phòng không liên kết với nhà.";
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    
    
}

export default ProblemService