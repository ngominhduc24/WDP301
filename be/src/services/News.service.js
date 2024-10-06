import HousesModel from "../models/Houses.model.js";
import NewsModel from "../models/News.model.js";
import getCurrentUser from "../utils/getCurrentUser.js";
import getPaginationData from "../utils/getPaginationData.js";

const NewsService = {
    addOne: async (req) => {
        try {
            const { houseId } = req.body;
            const house = await HousesModel.findById(houseId);
            if (!house) {
                throw new Error ("Not found houses")
            }
            const authorId = getCurrentUser(req);
            const data = await NewsModel.create({ ...req.body, authorId });
            return data;
        } catch (error) {
            throw error;
        }
    },
    getAll: async (req) => {
        try {
            const { houseId } = req.params;
            const { page, limit, title, content } = req.query;
            const query = { houseId,deleted: false };
            if (title) {
                query.title = { $regex: title, $options: "i" };
            }
            if (content) {
                query.content = { $regex: content, $options: "i" };
            }
            const populateField = ['authorId']
            const data = await getPaginationData(NewsModel, page, limit, query,populateField);
            return data;
        } catch (error) {
            throw error;
        }
    },
    getOne: async (req) => {
        try {
            const { newsId } = req.params;
            const data = await NewsModel.findById(newsId).populate([
                { path: "authorId" },
                { path: "commentsId" },
                { path: "likedBy" },
            ]);
            return {
                ...data._doc,
                liked: data.likedBy.length,
            };
        } catch (error) {
            throw error;
        }
    },
    updateOne: async (req) => {
        try {
            const { newsId } = req.params;
            await NewsModel.findByIdAndUpdate(newsId, { ...req.body });
            const newData = await NewsModel.findById(newsId);
            return newData;
        } catch (error) {
            throw error;
        }
    },
    deleteOne: async (req) => {
        try {
            const { newsId } = req.params;
            await NewsModel.findByIdAndUpdate(newsId, {
                deleted: true,
                deletedAt: Date.now(),
            });
            const newData = await NewsModel.findById(newsId);
            return newData;
        } catch (error) {
            throw error;
        }
    },
};

export default NewsService;
