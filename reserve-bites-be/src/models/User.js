import mongoose from '../config/mongo.config.js';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    address: { type: String, default: null },
    isOwner: { type: Boolean, default: false },
    password: { type: String, required: true, select: false },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    favoriteCuisines: [{ type: String, default: null }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('user', UserSchema);
