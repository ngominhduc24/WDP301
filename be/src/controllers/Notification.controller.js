import NotificationService from "../services/Notification.service.js";
import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js"

const NotificationController = {
    getAll: asyncHandler(async (req,res) => {
        try {
            const notifications = await NotificationService.getAll(req);
            if (notifications) return res.status(200).json(response.successResponse(200,notifications));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    updateOne: asyncHandler(async (req,res) => {
        try {
            const notifications = await NotificationService.updateOne(req);
            if (notifications) return res.status(200).json(response.successResponse(200,notifications));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
}

export default NotificationController