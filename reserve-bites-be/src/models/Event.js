import mongoose from '../config/mongoose.config';

const Schema = mongoose.Schema;
const EventSchema = new Schema({
  name: { type: String, require: true },
  description: { rtpe: String, require: true },
  imgs: [{ type: String, min: 1 }],
  endDate: { type: Date, require: true },
});

export default mongoose.model('event', EventSchema);
