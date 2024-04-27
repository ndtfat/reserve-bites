import Token from '../models/Token.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Notification from '../models/Notification.js';
import Conversation from '../models/Conversation.js';

const soketController = (io, socket) => {
  socket.emit('socket-connected');

  socket.on('user', async ({ uid, socketId }) => {
    socket.broadcast.emit('user-online', uid);
    await Token.findOneAndUpdate({ uid }, { socketId });
  });

  socket.on('send-notification', async (payload) => {
    const { senderId, receiver, type } = payload;

    if (receiver.rid) {
      const restaurant = await Restaurant.findById(receiver.rid);
      receiver.id = restaurant.toObject().owner;
    } else {
      receiver.id = receiver.uid;
    }

    const notification = new Notification({
      sender: senderId,
      receiver: receiver.id,
      type,
      additionalInfo: {
        ...(receiver.reservationId
          ? { reservationId: receiver.reservationId }
          : { rid: receiver.rid }),
      },
    });
    await notification.save();

    const receiverSocketId = (await Token.findOne({ uid: receiver.id }))?.toObject().socketId;

    // trigger receive-notification for receiver
    if (receiverSocketId) {
      let sentNotif = await notification.populate('sender');

      let restaurant = null; // if seender is restaurant
      if (sentNotif.sender.isOwner) {
        restaurant = await Restaurant.findOne({ owner: senderId });
      }

      io.to(receiverSocketId).emit('receive-notification', {
        ...sentNotif.toObject(),
        ...(restaurant ? { sender: restaurant } : {}),
      });
    }
  });

  socket.on('send-message', async (payload) => {
    const { conversationId, senderId, receiverId, message } = payload;
    const receiverSocketId = (await Token.findOne({ uid: receiverId }))?.toObject().socketId;
    let sender = await User.findById(senderId);

    const createdAt = new Date();

    // save into database
    if (conversationId) {
      const conversation = await Conversation.findById(conversationId);
      conversation.messages = [
        ...conversation.messages,
        { senderId, receiverId, message, createdAt },
      ];
      conversation.usersReaded = [senderId];
      await conversation.save();
    }

    // emit event
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive-message', {
        conversationId,
        sender,
        message,
        createdAt,
      });
    }
  });
};

export default soketController;
