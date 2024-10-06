import DefaultPriceModel from "../models/DefaultPrice.model.js"

const DefaultPriceService = {
    addOne: async ( req )=> {
        try {
            
            const data = await DefaultPriceModel.create({...req.body});
            return data
        } catch (error) {
            throw error
        }
    },
    getOne: async (req) => {
        try {
            const {defaultPriceId} = req.params;
            const data = await DefaultPriceModel.findById(defaultPriceId);
            return data;
        } catch (error) {
            throw error
        }
    },
    getAll: async (req) => {
        try {
            
            const data = await DefaultPriceModel.find({});
            return data;
        } catch (error) {
            throw error
        }
    }
}

export default DefaultPriceService