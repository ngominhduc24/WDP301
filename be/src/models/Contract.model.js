import { Schema, Types, model } from "mongoose";

const oneYearFromNow = () => {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  };

const Contract = new Schema({
    roomId: {
        type: Schema.ObjectId,
        ref: "Rooms"
    },
    startDate: {
        type: Date,
        default: Date.now(),
    },
    endDate: {
        type: Date,
        default: oneYearFromNow
    }
}, {timestamps: true})

export default model("Contract", Contract)
