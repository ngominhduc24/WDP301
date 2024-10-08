import { Schema, model } from "mongoose";

const News = Schema(
    {
        authorId: {
            type: Schema.ObjectId,
            ref: "Account",
        },
        houseId: {
            type: Schema.ObjectId,
            ref: "Houses",
        },
        title: {
            type: String,
            require: true,
        },
        content: {
            type: String,
            default: "",
        },
        images: [
            {
                type: String,
                default: [],
            },
        ],
        likedBy: [
            {
                type: Schema.ObjectId,
                ref: "Account",
                default: [],
            },
        ],
        commentsId: [
            {
                type: Schema.ObjectId,
                ref: "Comments",
                default: [],
            },
        ],
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default model("News", News);
