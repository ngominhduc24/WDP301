import HouseService from "../services/House.service.js"
import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js"
const HouseController = {
    addHouse: asyncHandler(async (req,res) => {
        try {
            const house = await HouseService.addHouse(req);
            if (house) return res.status(201).json(response.successResponse(201,house));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()))
        }
    }),
    getHouses: asyncHandler(async (req,res) => {
        try {
            const houses = await HouseService.getHouses(req);
            if (houses) return res.status(200).json(response.successResponse(200,houses));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            
            return res.status(500).json(response.errorResponse(500,error.toString()))
            
        }
    }),
    updateOne: asyncHandler(async (req,res) => {
        try {
            const house = await HouseService.updateOne(req);
            if (house) return res.status(200).json(response.successResponse(200,house));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            
            return res.status(500).json(response.errorResponse(500,error.toString()))
            
        }
    }),
    getOne: asyncHandler(async (req,res) => {
        try {
            const house = await HouseService.getOne(req);
            if (house) return res.status(200).json(response.successResponse(200,house));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            
            return res.status(500).json(response.errorResponse(500,error.toString()))
            
        }
    }),
    deleteOne: asyncHandler(async (req,res) => {
        try {
            const house = await HouseService.deleteOne(req);
            if (house) return res.status(200).json(response.successResponse(204,house));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            
            return res.status(500).json(response.errorResponse(500,error.toString()))
            
        }
    }),
    addPriceItem: asyncHandler(async (req,res) => {
        try {
            const price = await HouseService.addPriceItem(req);
            if (price) return res.status(200).json(response.successResponse(200,price));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            
            return res.status(500).json(response.errorResponse(500,error.toString()))
            
        }
    }),
    removePriceItem: asyncHandler(async (req,res) => {
        try {
            const price = await HouseService.removePriceItem(req);
            if (price) return res.status(200).json(response.successResponse(200,price));
            else return res.status(404).json(response.errorResponse(404));
        } catch (error) {
            
            return res.status(500).json(response.errorResponse(500,error.toString()))
            
        }
    }),
    
}

export default HouseController