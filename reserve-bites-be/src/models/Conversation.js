import mongoose, { mongo, version } from 'mongoose';

const Schema = mongoose.Schema;
const ConversationSchema = new Schema(
  {
    users: [{ type: String, required: true, ref: 'user' }],
    messages: [
      {
        type: {
          senderId: { type: String, required: true },
          receiverId: { type: String, required: true },
          message: { type: String },
          createdAt: { type: Date, required: true },
        },
        default: [],
      },
    ],
    usersReaded: [{ type: String, default: [] }],
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('conversation', ConversationSchema);
