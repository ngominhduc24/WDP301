import Notification from "../models/Notification.model.js";
import getCurrentUser from "../utils/getCurrentUser.js";
import mongoose from "mongoose";

const NotificationService = {
    getAll: async (req) => {
        try {
            const currentUserId = getCurrentUser(req); // Giả sử bạn đã có hàm này để lấy ID người dùng hiện tại
            const notifications = await Notification.aggregate([
                {
                    $match: {
                        "recipients.user": new mongoose.Types.ObjectId(currentUserId)
                    }
                },
                {
                    $unwind: "$recipients"
                },
                {
                    $match: {
                        "recipients.user": new mongoose.Types.ObjectId(currentUserId),
                    }
                },
                {
                    $lookup: {
                    from: "accounts", // Tên collection trong cơ sở dữ liệu của bạn
                    let: { senderId: "$sender" }, // Định nghĩa biến `senderId` để sử dụng trong pipeline
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$senderId"] // So sánh để tìm document phù hợp
                                }
                            }
                        },
                        {
                            $project: { name: 1, email: 1,avatar: 1,username :1,roomId: 1 } // Chỉ giới hạn lấy các trường `name` và `email`
                        }
                    ],
                    as: "senderDetails"
                }
                },
                {
                    $unwind: "$senderDetails" // Để "flatten" mảng senderDetails, giả sử mỗi thông báo chỉ có một người gửi
                },
                {
                    $sort: {
                        "createdAt": -1
                    }
                },
                {
                    $project: {
                        sender: "$senderDetails", // Đặt lại trường sender để chứa thông tin đã populate
                        message: 1,
                        type: 1,
                        link: 1,
                        isRead: "$recipients.isRead",
                        createdAt: 1,
                        updatedAt: 1,
                    }
                }
            ]);
    
            return notifications;
        } catch (error) {
            throw error;
        }
    },
    
    updateOne: async (req) => {
        try {
            const { notificationId } = req.params;
            const {isRead} = req.body
            const currentUserId = getCurrentUser(req);
    
            const notification = await Notification.findOneAndUpdate(
                {
                    _id: notificationId,
                    "recipients.user": new mongoose.Types.ObjectId(currentUserId),
                },
                {
                    $set: {
                        "recipients.$.isRead": isRead,
                    },
                },
                {
                    new: true, 
                }
            );
    
            if (!notification) {
                return { message: "Notification not found or you do not have permission to update it." };
            }
    
            return notification;
        } catch (error) {
            throw error;
        }
    }
};

export default NotificationService;
