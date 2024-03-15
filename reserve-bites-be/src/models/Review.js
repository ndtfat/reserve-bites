import mongoose from '../config/mongoose.config.js';

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    rid: { type: String, required: true, ref: 'restaurant' },
    dinerId: { type: String, required: true, ref: 'user' },
    food: { type: Number, required: true },
    content: { type: String, required: true },
    service: { type: Number, required: true },
    ambiance: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('review', ReviewSchema);
