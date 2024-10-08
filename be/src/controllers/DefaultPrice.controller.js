import DefaultPriceService from "../services/DefaultPrice.service.js";
import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js";

const DefaultPriceController = {
    addOne: asyncHandler(async (req,res) => {
        try {
            const defaultPrice = await DefaultPriceService.addOne(req);
            if (defaultPrice) return res.status(201).json(response.successResponse(201,defaultPrice));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getOne: asyncHandler(async (req,res) => {
        try {
            const defaultPrice = await DefaultPriceService.getOne(req);
            if (defaultPrice) return res.status(200).json(response.successResponse(200,defaultPrice));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getAll: asyncHandler(async (req,res) => {
        try {
            const defaultPrice = await DefaultPriceService.getAll(req);
            if (defaultPrice) return res.status(200).json(response.successResponse(200,defaultPrice));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    
    
    
}

export default DefaultPriceController