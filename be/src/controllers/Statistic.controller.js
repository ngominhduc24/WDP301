import statisticsService from "../services/Statistics.service.js";
import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js"

const StatisticController = {
    statisticGeneral: asyncHandler(async (req,res,next) => {
        try {
            const statistics = await statisticsService.statisticGeneral(req);
            if (statistics) return res.status(200).json(response.successResponse(200,statistics))
            else res.status(404).json(response.errorResponse(404));            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }

    }),
    statisticAllBills: asyncHandler(async (req,res,next) => {
        try {
            const statistics = await statisticsService.statisticAllBills(req);
            if (statistics) return res.status(200).json(response.successResponse(200,statistics))
            else res.status(404).json(response.errorResponse(404));            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }

    }),
    statisticProblem: asyncHandler(async (req,res,next) => {
        try {
            const statistics = await statisticsService.statisticProblem(req);
            if (statistics) return res.status(200).json(response.successResponse(200,statistics))
            else res.status(404).json(response.errorResponse(404));            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }

    }),
    statisticRevenue: asyncHandler(async (req,res,next) => {
        try {
            const statistics = await statisticsService.statisticRevenue(req);
            if (statistics) return res.status(200).json(response.successResponse(200,statistics))
            else res.status(404).json(response.errorResponse(404));            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }

    }),
    
}

export default StatisticController