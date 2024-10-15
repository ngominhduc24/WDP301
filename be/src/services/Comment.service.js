import CommentsModel from "../models/Comments.model.js";
import NewsModel from "../models/News.model.js";
import getCurrentUser from "../utils/getCurrentUser.js";
import getPaginationData from "../utils/getPaginationData.js";

const CommentService = {
  addOne: async (req) => {
    const { newsId } = req.params;
    const creatorId = getCurrentUser(req);

    try {
      const news = await NewsModel.findById(newsId);
      if (!news) {
        throw new Error("News not found");
      }

      const comment = await CommentsModel.create({
        ...req.body,
        creatorId,
        newsId,
      });
      news.commentsId.push(comment.id);
      await news.save();

      return comment;
    } catch (error) {
      throw error;
    }
  },

  getAll: async (req) => {
    const { newsId } = req.params;
    const { page, limit } = req.params;

    try {
      const news = await NewsModel.findById(newsId);
      if (!news) {
        throw new Error("News not found");
      }

      const query = { newsId, deleted: false };
      const populateFields = ["creatorId"];
      const data = await getPaginationData(
        CommentsModel,
        page,
        limit,
        query,
        populateFields
      );

      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default CommentService;
