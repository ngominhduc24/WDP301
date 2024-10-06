import RoomService from "../services/Room.service.js"
import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js"
import fs from 'fs'
import path from "path"
const RoomController = {
    addRoom: asyncHandler(async (req,res,next) => {
        try {
            const room = await RoomService.addRoom(req);
            if (room) return res.status(201).json(response.successResponse(201))
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }

    }),
    addOne: asyncHandler(async (req,res,next) => {
        try {
            const room = await RoomService.addOne(req);
            if (room) return res.status(201).json(response.successResponse(201,room))
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }

    }),
    getRooms: asyncHandler(async (req,res,next) => {
        try {
            const rooms = await RoomService.getRooms(req);
            if (rooms) return res.status(200).json(response.successResponse(200,rooms))
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500));
        }

    }),
    getOne: asyncHandler(async (req,res,next) => {
        try {
            const room = await RoomService.getOne(req);
            if (room) return res.status(200).json(response.successResponse(200,room))
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }
    }),
    updateOne: asyncHandler(async (req,res,next) => {
        try {
            const room = await RoomService.updateOne(req);

            if (room) { return res.status(200).json(response.successResponse(204,room))}
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500));
        }
    }),
    deletedOne: asyncHandler(async (req,res,next) => {
        try {
            const room = await RoomService.deleteOne(req);

            if (room) { return res.status(200).json(response.successResponse(204,room))}
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500));
        }
    }),
    downloadTemplate: asyncHandler(async (req,res,next) => {
        const TEMPLATE_PATH = './static/Room.xlsx';
        const templateFileStream = fs.createReadStream(TEMPLATE_PATH);
        const templateFileName = path.basename(TEMPLATE_PATH);
        
        res.setHeader('Content-disposition', `attachment; filename=${templateFileName}`);
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        templateFileStream.pipe(res);
    }),
    getFloor: asyncHandler(async (req,res,next) => {
        try {
            const floor = await RoomService.getFloor(req);

            if (floor) { return res.status(200).json(response.successResponse(200,floor))}
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500));
        }
    }),
    addMember: asyncHandler(async (req,res,next) => {
        try {
            const member = await RoomService.addMember(req);

            if (member) { return res.status(201).json(response.successResponse(201,member))}
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }
    }),
    removeMember: asyncHandler(async (req,res,next) => {
        try {
            const member = await RoomService.removeMember(req);

            if (member) { return res.status(200).json(response.successResponse(200,member))}
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500));
        }
    }),
    updateMember: asyncHandler(async (req,res,next) => {
        try {
            const member = await RoomService.updateMember(req);

            if (member) { return res.status(200).json(response.successResponse(200,member))}
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }
    }),
    getMember: asyncHandler(async (req,res,next) => {
        try {
            const member = await RoomService.getMember(req);

            if (member) { return res.status(200).json(response.successResponse(200,member))}
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }
    }),
    countRoomsByMembership: asyncHandler(async (req,res,next) => {
        try {
            const member = await RoomService.countRoomsByMembership(req);

            if (member) { return res.status(200).json(response.successResponse(200,member))}
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }
    }),
    getRoomWithBills: asyncHandler(async (req,res,next) => {
        try {
            const rooms = await RoomService.getRoomWithBills(req);

            if (rooms) { return res.status(200).json(response.successResponse(200,rooms))}
            else res.status(404).json(response.errorResponse(404));
            
        } catch (error) {
            return res.status(500).json(response.errorResponse(500,error.toString()));
        }
    }),


}

export default RoomController