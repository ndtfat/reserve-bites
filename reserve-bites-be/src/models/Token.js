import mongoose from "../config/mongo.config.js";

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  uid: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  resetPasswordToken: { type: String },
}, {
  versionKey: false,
});

export default mongoose.model("token", TokenSchema);
