import DefaultPriceModel from "../models/DefaultPrice.model.js";
import HousesModel from "../models/Houses.model.js";
import RoomsModel from "../models/Rooms.model.js";
import getCurrentUser from "../utils/getCurrentUser.js";
const HouseService = {
    addHouse: async (req) => {
        const {
            name,
            status,
            location,
            electricPrice,
            waterPrice,

            utilities,
            otherUtilities,
            rules,
        } = req.body;
        const defaultPriceWater = await DefaultPriceModel.findOne({
            name: "Tiền nước theo khối",
        });
        const defaultPriceElectric = await DefaultPriceModel.findOne({
            name: "Tiền điện theo số (kWh)",
        });

        const priceList = [
            {
                base: defaultPriceWater.id,
                price: waterPrice,
            },
            {
                base: defaultPriceElectric.id,
                price: electricPrice,
            },
        ];
        const hostId = getCurrentUser(req);
        const house = new HousesModel({
            name,
            status,
            location,
            electricPrice,
            waterPrice,
            priceList,
            utilities,
            otherUtilities,
            rules,
            hostId,
        });
        await house.save();

        return house;
    },
    getHouses: async (req) => {
        try {
            const hostId = getCurrentUser(req);
            const { page, limit, option } = req.query;
            const pageNumber = parseInt(page) || 1;
            const limitPerPage = parseInt(limit) || 10;
            const skip = (pageNumber - 1) * limitPerPage;

            const totalHouses = await HousesModel.countDocuments({});
            const totalPages = Math.ceil(totalHouses / limitPerPage);
            let data;

            if (String(option) === "all") {
                data = await HousesModel.find({ hostId, deleted: false })
                    .populate([
                        { path: "utilities" },
                        { path: "otherUtilities" },
                        { path: "hostId" },
                        { path: "priceList", populate: { path: "base" } },
                    ])
                    .sort({ createdAt: -1 })
                    .exec();
                return {
                    houses: data,
                };
            } else {
                data = await HousesModel.find({ hostId, deleted: false })
                    .populate([
                        { path: "utilities" },
                        { path: "otherUtilities" },
                        { path: "hostId" },
                        { path: "priceList", populate: { path: "base" } },
                    ])
                    .skip(skip)
                    .limit(limitPerPage)
                    .sort({ createdAt: -1 })
                    .exec();
                return {
                    pagination: {
                        currentPage: pageNumber,
                        totalPages: totalPages,
                        totalRooms: totalHouses,
                        roomsPerPage: data.length,
                    },
                    houses: data,
                };
            }
        } catch (error) {
            throw new Error(error.toString());
        }
    },
    updateOne: async (req) => {
        try {
            const { houseId } = req.params;
            await HousesModel.findByIdAndUpdate(houseId, { ...req.body });
            const newData = await HousesModel.findById(houseId);
            return newData;
        } catch (error) {
            throw new Error(error.toString());
        }
    },
    getOne: async (req) => {
        try {
            const { houseId } = req.params;
            const data = await HousesModel.findById(houseId).populate([
                { path: "utilities" },
                { path: "otherUtilities" },
                { path: "hostId" },
                { path: "priceList", populate: { path: "base" } },
            ]);

            return data;
        } catch (error) {
            throw new Error(error.toString());
        }
    },
    deleteOne: async (req) => {
        try {
            const { houseId } = req.params;
            await HousesModel.findByIdAndUpdate(houseId, {
                deleted: true,
                deletedAt: Date.now(),
            });
            const newData = await HousesModel.findById(houseId);
            await RoomsModel.updateMany({houseId},{deleted:true,deletedAt: Date.now(),});
            return newData;
        } catch (error) {
            throw new Error(error.toString());
        }
    },
    addPriceItem: async (req) => {
        try {
            const { houseId } = req.params;
            const { base, price } = req.body;
            const house = await HousesModel.findById(houseId).populate("priceList.base");
            
            const existingPriceItem = house.priceList.find(item => item.base.id === base);
            if (existingPriceItem) {
                throw new Error('Đơn giá đã được tồn tại');
            }
            house.priceList = [...house.priceList, { base, price }];
            await house.save();
            const newHouse = await HousesModel.findById(houseId).populate(
                "priceList.base"
            );
            return newHouse.priceList[`${newHouse.priceList.length - 1}`];
        } catch (error) {
            throw error;
        }
    },
    updatePriceItem: async (req) => {
        try {
            const { houseId } = req.params;
            const { id, base, price } = req.body;
        } catch (error) {
            throw error;
        }
    },
    removePriceItem: async (req) => {
        try {
            const { houseId, priceItemId } = req.params;
    
            const house = await HousesModel.findById(houseId);
    
            const indexToRemove = house.priceList.findIndex(item => item._id.toString() === priceItemId);
            if (indexToRemove === -1) {
                throw new Error('Price item not found');
            }
    
            house.priceList.splice(indexToRemove, 1);
            await house.save();
    
            return { message: 'Đơn giá xoá thành công' };
        } catch (error) {
            throw error;
        }
    },
};

export default HouseService;
