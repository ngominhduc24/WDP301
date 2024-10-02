import NewsService from "../services/News.service.js";
import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js"

const NewsController = {
    addOne: asyncHandler(async (req,res) => {
        try {
            const news = await NewsService.addOne(req);
            if (news) return res.status(201).json(response.successResponse(201,news));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getAll: asyncHandler(async (req,res) => {
        try {
            const news = await NewsService.getAll(req);
            if (news) return res.status(200).json(response.successResponse(200,news));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getOne: asyncHandler(async (req,res) => {
        try {
            const news = await NewsService.getOne(req);
            if (news) return res.status(200).json(response.successResponse(200,news));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    updateOne: asyncHandler(async (req,res) => {
        try {
            const news = await NewsService.updateOne(req);
            if (news) return res.status(200).json(response.successResponse(200,news));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    deleteOne: asyncHandler(async (req,res) => {
        try {
            const news = await NewsService.deleteOne(req);
            if (news) return res.status(200).json(response.successResponse(200,news));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
}

export default NewsController