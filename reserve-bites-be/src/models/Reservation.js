import mongoose from "../config/mongo.config.js";

const Schema = mongoose.Schema;

const ReservationSchema = new Schema(
  {
    rid: { type: String, required: true, ref: "restaurant" },
    dinerId: { type: String, required: true, ref: "user" },
    size: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: Date, requried: true },
    status: { type: String, enum: ['confirmed', 'responding', 'canceled', 'completed'], default: 'responding' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model("reservation", ReservationSchema);
