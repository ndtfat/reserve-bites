import mongoose from '../config/mongo.config.js';

const Schema = mongoose.Schema;
const ImageSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    state: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('image', ImageSchema);
