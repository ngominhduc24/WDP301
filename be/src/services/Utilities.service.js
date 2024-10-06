import DefaultUtilitiesModel from "../models/DefaultUtilities.model.js";
import OtherUtilitiesModel from "../models/OtherUtilities.model.js";
import getCurrentUser from "../utils/getCurrentUser.js";
const UtilitiesService = {
    addDefaultUtilities : async (req) => {
        const {utilities} = req.body;
        const data = await DefaultUtilitiesModel.insertMany(utilities);
        return data
    },
    
    getDefaultUtilities : async (req) =>{
        try {
            
            const data = await DefaultUtilitiesModel.find();
            return data
        } catch (error) {
            throw error
        }
    },

    addOtherUtilities: async (req) => {
        const userID = getCurrentUser(req);
        const {name} = req.body;
        const data = await OtherUtilitiesModel.create({userID,name});
        return data
        
    },

    getOtherUtilities: async (req) => {
        const userID = getCurrentUser(req);
        const data = await OtherUtilitiesModel.find({userID});
        return data;
    }


}

export default UtilitiesService