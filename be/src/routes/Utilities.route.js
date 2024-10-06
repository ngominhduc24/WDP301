import express from 'express'
import UtilitiesController from '../controllers/Utilities.controller.js';

const UtilitiesRoute = express.Router();
UtilitiesRoute.get("/otherUtilities",UtilitiesController.getOtherUtilities)
UtilitiesRoute.get("/",UtilitiesController.getDefaultUtilities)
UtilitiesRoute.post("/otherUtilities",UtilitiesController.addOtherUtilities)
UtilitiesRoute.post("/",UtilitiesController.addDefaultUtilities)


export default UtilitiesRoute