import UtilitiesService from "../services/Utilities.service.js";
import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js";

const UtilitiesController = {
    addDefaultUtilities : asyncHandler(async (req,res,next) => {
        const utilities = await UtilitiesService.addDefaultUtilities(req);
        if (utilities) return res.status(201).json(response.successResponse(201,utilities))
        else return res.status(404).json(response.errorResponse(404))
    }),
    addOtherUtilities:  asyncHandler(async (req,res,next) => {
        const utilities = await UtilitiesService.addOtherUtilities(req);
        if (utilities) return res.status(201).json(response.successResponse(201,utilities))
        else return res.status(404).json(response.errorResponse(404))
    }),
    getDefaultUtilities:  asyncHandler(async (req,res,next) => {
        const utilities = await UtilitiesService.getDefaultUtilities(req);
        if (utilities) return res.status(201).json(response.successResponse(201,utilities))
        else return res.status(404).json(response.errorResponse(404))
    }),
    getOtherUtilities:  asyncHandler(async (req,res,next) => {
        const utilities = await UtilitiesService.getOtherUtilities(req);
        if (utilities) return res.status(201).json(response.successResponse(201,utilities))
        else return res.status(404).json(response.errorResponse(404))
    }),
}

export default UtilitiesController