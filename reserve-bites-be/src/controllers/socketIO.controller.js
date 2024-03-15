import Restaurant from '../models/Restaurant.js';
import Token from '../models/Token.js';
import Notification from '../models/Notification.js';

const soketController = (io, socket) => {
  // console.log(socket.id + 'connected');

  socket.emit('socket-connected');

  socket.on('user', async ({ uid, socketId }) => {
    socket.broadcast.emit('user-online', uid);
    await Token.findOneAndUpdate({ uid }, { socketId });
  });

  socket.on('send-notification', async (payload) => {
    const { senderId, receiver, type } = payload;

    if (receiver.type === 'OWNER') {
      const restaurant = await Restaurant.findById(receiver.rid);
      receiver.id = restaurant.toObject().ownerId;
    } else {
      receiver.id = receiver.id;
    }

    const notification = new Notification({
      senderId,
      receiverId: receiver.id,
      type,
      additionalInfo: {
        ...(receiver.rid ? { rid: receiver.rid } : {}),
      },
    });
    await notification.save();

    const receiverSocketId = (await Token.findOne({ uid: receiver.id })).toObject().socketId;

    // trigger receive-notification for receiver
    if (receiverSocketId) {
      let sentNotif = await notification.populate('senderId');
      sentNotif = sentNotif.toObject();
      sentNotif.sender = sentNotif.senderId;
      delete sentNotif.senderId;

      io.to(receiverSocketId).emit('receive-notification', sentNotif);
    }
  });
};

export default soketController;
