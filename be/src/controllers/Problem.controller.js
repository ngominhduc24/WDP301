import ProblemService from "../services/Problem.service.js";
import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js"

const ProblemController = {
    addOne: asyncHandler(async (req,res) => {
        try {
            const problem = await ProblemService.addOne(req);
            if (problem) return res.status(201).json(response.successResponse(201,problem));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getInHouse: asyncHandler(async (req,res) => {
        try {
            const problem = await ProblemService.getInHouse(req);
            if (problem) return res.status(200).json(response.successResponse(200,problem));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getInRoom: asyncHandler(async (req,res) => {
        try {
            const problem = await ProblemService.getInRoom(req);
            if (problem) return res.status(200).json(response.successResponse(200,problem));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getByFilter: asyncHandler(async (req,res) => {
        try {
            const problem = await ProblemService.getByFilter(req);
            if (problem) return res.status(200).json(response.successResponse(200,problem));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getOne: asyncHandler(async (req,res) => {
        try {
            const problem = await ProblemService.getOne(req);
            if (problem) return res.status(200).json(response.successResponse(200,problem));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    updateOne: asyncHandler(async (req,res) => {
        try {
            const problem = await ProblemService.updateOne(req);
            if (problem) return res.status(200).json(response.successResponse(200,problem));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    deleteOne: asyncHandler(async (req,res) => {
        try {
            const problem = await ProblemService.deleteOne(req);
            if (problem) return res.status(200).json(response.successResponse(200,problem));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    resetProblem: asyncHandler(async (req,res) => {
        try {
            const problem = await ProblemService.resetProblem(req);
            if (problem) return res.status(200).json(response.successResponse(200,problem));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
}

export default ProblemController