
import express from "express";
import AuthRoute from "./auth.route.js";
import HouseRoute from "./House.router.js";
import AccountRoute from "./Account.route.js";
import {verifyToken} from "../middlewares/verifyToken.middleware.js";
import newsRouter from "./news.router.js";

const indexRouter = express.Router();

indexRouter.use("/house",verifyToken,HouseRoute)
indexRouter.use("/account",verifyToken, AccountRoute)
indexRouter.use("/auth", AuthRoute);
indexRouter.use("/news",verifyToken,newsRouter)

export default indexRouter;