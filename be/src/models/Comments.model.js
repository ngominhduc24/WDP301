import { Schema, model } from "mongoose";

const Comments = Schema({
    creatorId : {
        type: Schema.ObjectId,
        ref: "Account"
    },
    content: {
        type: String,
        default: ""
    },
    newsId: {
        type: Schema.ObjectId,
        ref: "News"
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type:  Date,
        default: null,
    }
})

export default model("Comments",Comments)