import express from "express";
import NewsController from "../controllers/News.controller.js";
import CommentController from "../controllers/Comment.controller.js";
const newsRouter = express.Router();

newsRouter.get("/:newsId/comment",CommentController.getAll)
newsRouter.post("/:newsId/comment",CommentController.addOne)
newsRouter.get("/:newsId",NewsController.getOne)
newsRouter.get("/house/:houseId/",NewsController.getAll)
newsRouter.post("/",NewsController.addOne);
newsRouter.put("/:newsId",NewsController.updateOne);
newsRouter.delete("/:newsId",NewsController.deleteOne)

export default newsRouter