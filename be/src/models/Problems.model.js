import { Schema,model } from "mongoose";

const Problems = Schema ({
    type: {
        type: String,
        enum: ["common","electric","water","other"],
        default: "common",
        require: true,
    },
    status: {
        type: String,
        enum: ["none","doing","pending","done"],
        default: "none",
    },
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
    },
    roomId: {
        type: Schema.ObjectId,
        ref: "Rooms"
    },
    houseId : {
        type: Schema.ObjectId,
        ref: "Houses"
    },
    creatorId: {
        type: Schema.ObjectId,
        ref: "Account"
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type : Date,
        default: null
    }
},{timestamps: true})

export default model("Problems",Problems)