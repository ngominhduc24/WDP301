import { Schema, Types, model } from "mongoose";

const rule = new Schema({
    name: {
        type: String,
        default: "",
    },
});
const priceItemSchema = new Schema({
    base: {
        type: Schema.ObjectId,
        ref: "DefaultPrice",
    },
    price: {
        type: Number,
        require: true
    }
})
const LocationSchema = new Schema({
    district: {
        type: String,
        default: "",
    },
    ward: {
        type: String,
        default: "",
    },
    province: {
        type: String,
        default: "",
    },
    detailLocation: {
        type: String,
        default: "",
    }
});
const Houses = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        status: {
            type: Boolean,
            require: true,
        },
        location: {
            type: LocationSchema,
            default: {},
        },
        numberOfRoom: {
            type: Number,
            default: 0,
        },
        electricPrice: {
            type: Number,
            require: true,
        },
        waterPrice: {
            type: Number,
            require: true,
        },
        servicePrice: {
            type: Number,
            require: true,
        },
        priceList: [
            {
                type: priceItemSchema,
                default: {},
                unique: true,
            }
        ],
        utilities: [
            {
                type: Schema.ObjectId,
                ref: "DefaultUtilities",
            },
        ],
        otherUtilities: [
            {
                type: Schema.ObjectId,
                ref: "OtherUtilities",
            },
        ],
        
        hostId: {
            type: Schema.ObjectId,
            ref: "Account",
        },
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

export default model("Houses", Houses);
