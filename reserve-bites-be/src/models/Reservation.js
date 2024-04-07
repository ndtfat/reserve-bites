import mongoose from '../config/mongoose.config.js';

const Schema = mongoose.Schema;
const ReservationSchema = new Schema(
  {
    rid: { type: String, required: true, ref: 'restaurant' },
    dinerId: { type: String, required: true, ref: 'user' },
    size: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: Date, requried: true },
    cancelMessage: { type: { message: { type: String, default: '' }, createdAt: { type: Date } } },
    versions: [
      {
        type: {
          size: { type: Number, required: true },
          date: { type: Date, required: true },
          time: { type: Date, requried: true },
          createdAt: { type: Date, default: new Date() },
          status: {
            type: String,
            enum: ['confirmed', 'responding', 'canceled', 'completed', 'expired', 'rejected'],
            default: 'responding',
          },
        },
      },
    ],
    status: {
      type: String,
      enum: ['confirmed', 'responding', 'canceled', 'completed', 'expired', 'rejected'],
      default: 'responding',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export default mongoose.model('reservation', ReservationSchema);
