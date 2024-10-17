import express from 'express'
import NotificationController from '../controllers/Notification.controller.js';

const notificationRoute = express.Router();

notificationRoute.get("/",NotificationController.getAll)
notificationRoute.put("/:notificationId",NotificationController.updateOne)



export default notificationRoute