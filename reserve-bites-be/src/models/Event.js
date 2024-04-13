import mongoose from '../config/mongoose.config.js';

const Schema = mongoose.Schema;
const EventSchema = new Schema({
  name: { type: String, required: true },
  restaurant: { type: String, required: true },
  poster: { type: String, required: true, ref: 'image' },
  endDate: { type: Date, required: true },
  desc: { type: String, required: true },
});

export default mongoose.model('event', EventSchema);
