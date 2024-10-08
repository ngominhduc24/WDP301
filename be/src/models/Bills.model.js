import { Schema, model } from "mongoose";

const priceItemSchema = Schema({
    base: {
        type: Schema.ObjectId,
        ref: "DefaultPrice",
    },
    unitPrice: {
        type: Number
    },
    startUnit: {
        type: Number,
    },
    endUnit: {
        type: Number,
    },
    totalUnit: {
        type: Number,
    } 
})

const Bills = Schema({
    roomId : {
        type: Schema.ObjectId,
        ref: "Rooms"
    },
    houseId: {
        type: Schema.ObjectId,
        ref: "Houses"
    },
    billCode: {
        type: Number
    },
    roomPrice: {
        type: Number,
        require : true,
    },
    priceList: [{
        type : priceItemSchema
    }],
    debt: {
        type: Number,
        require: true,
    },
    total: {
        type: Number,
    },
    note: {
        type: String,
        default: ""
    },
    paymentLink: {
        type: Object,

    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paymentMethod: {
        type: String,
        enum: ["Banking","Cash",""],
        default: ""
    }
},{timestamps: true})

export default model("Bills",Bills)