import { Schema, model } from "mongoose";

const OtherUtilities = Schema({
    userID : {
        type: Schema.ObjectId,
        ref: "Account"
    },
    name: {
        type: String,
        default: ""
    }
})

export default model("OtherUtilities",OtherUtilities)