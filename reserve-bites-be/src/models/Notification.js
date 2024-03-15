import mongoose from '../config/mongoose.config.js';

const Schema = mongoose.Schema;
const NotificationSchema = new Schema(
  {
    senderId: { type: String, required: true, ref: 'user' },
    receiverId: { type: String, required: true, ref: 'user' },
    type: {
      type: String,
      enum: ['RESERVATION', 'POST_REVIEW', 'UPDATE_REVIEW', 'DELETE_REVIEW'],
      require: true,
    },
    readed: { type: Boolean, default: false },
    additionalInfo: {
      type: {
        rid: { type: String },
        reservationId: { type: String },
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export default mongoose.model('notification', NotificationSchema);
