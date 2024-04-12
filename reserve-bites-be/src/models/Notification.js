import mongoose from '../config/mongoose.config.js';

const Schema = mongoose.Schema;
const NotificationSchema = new Schema(
  {
    sender: { type: String, required: true, ref: 'user' },
    receiver: { type: String, required: true, ref: 'user' },
    type: {
      type: String,
      enum: [
        'MAKE_RESERVATION',
        'POST_REVIEW',
        'UPDATE_REVIEW',
        'DELETE_REVIEW',
        'REJECT_RESERVATION',
        'UPDATE_RESERVATION',
        'CANCEL_RESERVATION',
        'CONFIRM_RESERVATION',
      ],
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
