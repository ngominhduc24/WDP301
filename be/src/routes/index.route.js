
import express from "express";
import AuthRoute from "./auth.route.js";
import GoogleAuthRoute from "./googleAuth.route.js";
import AccountRoute from "./Account.route.js";
import FacebookAuthRoute from "./facebookAuth.route.js";
import {verifyToken} from "../middlewares/verifyToken.middleware.js";
import HouseRoute from "./House.router.js";
import UtilitiesRoute from "./Utilities.route.js";
import problemRoute from "./problem.router.js";
import newsRouter from "./news.router.js";
import defaultPriceRoute from "./DefaultPrice.route.js";
import paymentRoute from "./Payment.route.js";
import billRoute from "./Bill.route.js";
import RoomController from "../controllers/Room.controller.js";
import notificationRoute from "./notification.router.js";
import statisticRoute from "./statistic.route.js";

const indexRouter = express.Router();

indexRouter.use("/news",verifyToken,newsRouter)
indexRouter.use("/problem",verifyToken,problemRoute)
indexRouter.use("/utilities",verifyToken,UtilitiesRoute)
indexRouter.use("/house",verifyToken,HouseRoute)
indexRouter.use("/account",verifyToken, AccountRoute)
indexRouter.use("/auth/google", GoogleAuthRoute)
indexRouter.use("/auth/facebook",FacebookAuthRoute)
indexRouter.use("/auth", AuthRoute);
indexRouter.use("/defaultPrice",defaultPriceRoute)
indexRouter.use("/payment",paymentRoute)
indexRouter.use("/bill",verifyToken,billRoute)
indexRouter.use("/downloadTemplate",RoomController.downloadTemplate)
indexRouter.use("/notification",verifyToken,notificationRoute)
indexRouter.use("/statistic",verifyToken,statisticRoute)

export default indexRouter;