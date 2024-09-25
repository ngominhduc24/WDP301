import { Schema, model } from "mongoose";

const PasswordResetCode = new Schema({
  code: {
    type: String,
    require: true,
  },
  expiresAt: {
    type: Date,
    default: new Date(Date.now()),
    expires: "1h",
  },
});

export default model("PasswordResetCode", PasswordResetCode);
