import { Schema, Types, model } from "mongoose";

const DefaultPrice = new Schema({
    name: {
        type: String,
        default: "",
    },
    unit: {
        type: String,
        enum: ["đồng/tháng","đồng/quý","đồng/kWh","đồng/khối","đồng/người"],
        default: "",
    },
    
});

export default model("DefaultPrice", DefaultPrice);