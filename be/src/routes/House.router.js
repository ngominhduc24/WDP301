import express from 'express'
import HouseController from '../controllers/House.controller.js';
import RoomController from '../controllers/Room.controller.js';

import multer from 'multer'
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import validateData from '../validations/ValidateData.js';
import RoomValidate from '../validations/Room.validate.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {v2 as cloudinary} from 'cloudinary';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const storageCloudinary = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads',
      format: async (req, file) => {
        // Trả về phần mở rộng của tệp
        const ext = file.originalname.split('.').pop();
        return ext;
      },
      public_id: (req, file) => file.originalname,
    },
  });
const parserCloudinary = multer({ storage: storageCloudinary });
const HouseRoute = express.Router();

HouseRoute.get('/:houseId/getRoomWithBills',RoomController.getRoomWithBills)
HouseRoute.get('/:houseId/membership',RoomController.countRoomsByMembership)
HouseRoute.get("/:houseId/floor",RoomController.getFloor)
HouseRoute.get("/downloadTemplate",RoomController.downloadTemplate)
HouseRoute.post("/room/addOne/:houseId",RoomController.addOne)
HouseRoute.post("/room",upload.single('excelFile'),RoomController.addRoom)
HouseRoute.get("/room/:roomId",RoomController.getOne)
HouseRoute.get("/room/:roomId/member/:memberId",RoomController.getMember)
HouseRoute.post("/room/:roomId/member",parserCloudinary.single('avatar'),RoomController.addMember)
HouseRoute.put("/room/:roomId/delete/member",RoomController.removeMember)
HouseRoute.put("/room/:roomId/member",parserCloudinary.single('avatar'),RoomController.updateMember)
HouseRoute.put("/room/:roomId",RoomController.updateOne)
HouseRoute.put("/:houseId/addPriceItem",HouseController.addPriceItem)
HouseRoute.put("/:houseId/removePriceItem/:priceItemId",HouseController.removePriceItem)
HouseRoute.get("/:houseId/room",RoomController.getRooms)
HouseRoute.delete("/room/:roomId",RoomController.deletedOne)
HouseRoute.get("/:houseId",HouseController.getOne)
HouseRoute.post("/:houseId",HouseController.updateOne)
HouseRoute.delete("/:houseId", HouseController.deleteOne)
HouseRoute.post("/", HouseController.addHouse)
HouseRoute.get("/",HouseController.getHouses)

export default HouseRoute