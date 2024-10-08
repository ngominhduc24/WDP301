import express from "express";
import DefaultPriceController from "../controllers/DefaultPrice.controller.js";
const defaultPriceRoute = express.Router();

defaultPriceRoute.post("/",DefaultPriceController.addOne);
defaultPriceRoute.get("/:defaultPriceId",DefaultPriceController.getOne);
defaultPriceRoute.get("/",DefaultPriceController.getAll);

export default defaultPriceRoute