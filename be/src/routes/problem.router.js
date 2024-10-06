import express from "express";
import ProblemController from "../controllers/Problem.controller.js";
import { verifyTokenRenter } from "../middlewares/verifyToken.middleware.js";
const problemRoute = express.Router();

problemRoute.delete("/reset",ProblemController.resetProblem)
problemRoute.get("/house/:houseId",ProblemController.getInHouse)
problemRoute.get("/:problemId",ProblemController.getOne)
problemRoute.get("/room/:roomId",ProblemController.getByFilter)
problemRoute.post("/",ProblemController.addOne);
problemRoute.put("/:problemId",ProblemController.updateOne);
problemRoute.delete("/:problemId",ProblemController.deleteOne)

export default problemRoute