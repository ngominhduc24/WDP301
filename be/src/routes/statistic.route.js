import express from 'express'
import StatisticController from '../controllers/Statistic.controller.js';

const statisticRoute = express.Router();

statisticRoute.get("/general",StatisticController.statisticGeneral)
statisticRoute.get("/bills",StatisticController.statisticAllBills)
statisticRoute.get("/problems",StatisticController.statisticProblem)
statisticRoute.get("/revenue",StatisticController.statisticRevenue)



export default statisticRoute