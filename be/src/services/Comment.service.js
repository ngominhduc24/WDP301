import CommentsModel from "../models/Comments.model.js";
import NewsModel from "../models/News.model.js";
import getCurrentUser from "../utils/getCurrentUser.js";
import getPaginationData from "../utils/getPaginationData.js";


const CommentService = {
    addOne: async (req) => {
        try {
            const {newsId} = req.params;
            const creatorId = getCurrentUser(req);
            const news = await NewsModel.findById(newsId);
            if (!news){
                throw new Error("News not found");
            }
            else{

                const comment = await CommentsModel.create({...req.body,creatorId,newsId});
                news.commentsId =[...news.commentsId,comment.id];
                await news.save();
                return comment
            }
        } catch (error) {
            throw error;
        }
    },
    getAll: async (req) => {
        try {
            const {newsId} = req.params;
            const {page,limit} = req.params;
            const news = await NewsModel.findById(newsId);
            const query = {newsId,deleted:false}
            if (!news){
                throw new Error("News not found");
            }
            else{
                const populateFields = ["creatorId"];
                const data = await getPaginationData(CommentsModel,page,limit,query,populateFields);
                return data;
            }
        } catch (error) {
            throw error
        }
    }
}

export default CommentService
