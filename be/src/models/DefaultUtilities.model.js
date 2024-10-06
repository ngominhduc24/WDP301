import { Schema, model } from "mongoose";

const DefaultUtilities = Schema({
    name: {
        type: String,
        default: ""
    }
})

export default model("DefaultUtilities", DefaultUtilities);