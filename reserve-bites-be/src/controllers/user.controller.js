import User from '../models/User.js';
import bcrypt from 'bcrypt';

import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Notification from '../models/Notification.js';
import Conversation from '../models/Conversation.js';

export default {
  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = id === 'me' ? req.user : await User.findById(id);
      let rid = undefined;

      if (user.isOwner) {
        const restaurant = await Restaurant.findOne({ ownerId: user.id });
        rid = restaurant.id;
      }
      const { password, ...safeInfo } = user.toObject();

      return res.status(200).send({
        ...safeInfo,
        ...(rid ? { rid } : {}),
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with get user' });
    }
  },
  async putChangeInfo(req, res) {
    try {
      const user = req.user;
      const { firstName, lastName, email, address, favoriteCuisines } = req.body;
      user.email = email || user.email;
      user.address = address || user.address;
      user.lastName = lastName || user.lastName;
      user.firstName = firstName || user.firstName;
      user.favoriteCuisines = favoriteCuisines || user.favoriteCuisines;
      await user.save();

      console.log('Update info ' + user.id);
      return res.status(200).send(user.toObject());
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with change info' });
    }
  },
  async putChangePassword(req, res) {
    try {
      const user = await User.findById(req.user.id).select('+password');
      const { oldPassword, newPassword } = req.body;

      const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidOldPassword)
        return res.status(403).send({ message: 'Old password is not correct' });

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      console.log('Update password ' + user.id);
      return res.status(200).send({ message: 'Change password success' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with change password', error });
    }
  },
  async postReservation(req, res) {
    try {
      const payload = req.body;
      const newReservation = new Reservation(payload);
      await newReservation.save();
      return res.status(200).send({ reservationId: newReservation.id });
    } catch (error) {
      res.status(500).send({
        message: 'Something wrong with get reserve restaurant',
        error,
      });
    }
  },
  async getUserReservations(req, res) {
    try {
      const user = req.user;
      const { page, sortBy, pageSize, offset } = req.paginator;

      const totalItems = await Reservation.countDocuments({ dinerId: user.id });
      const totalPages = Math.ceil(totalItems / pageSize);
      if (page > totalPages && totalPages !== 0) {
        return res.status(404).send({ message: 'Page not found', totalPages });
      }

      let reservations = await Reservation.find({ dinerId: user.id })
        .sort({ createdAt: sortBy })
        .skip(offset)
        .limit(pageSize)
        .populate('rid');

      console.log('get reservations[]');

      if (reservations) {
        reservations = reservations.map((item) => {
          item = item.toObject();
          item.restaurant = item.rid.name;
          delete item.rid;
          return item;
        });

        return res.status(200).send({
          page,
          totalItems,
          totalPages,
          itemsList: reservations,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Something wrong with get users reservations',
        error,
      });
    }
  },
  async postReview(req, res) {
    try {
      const { rid, food, service, ambiance, content, dinerId } = req.body;
      const restaurant = await Restaurant.findById(rid);
      const numberOfReviewsOfRestaurant = await Review.countDocuments({ rid });

      const userAvarageRate = (food + service + ambiance) / 3;

      restaurant.rate = (
        (restaurant.rate * numberOfReviewsOfRestaurant + userAvarageRate) /
        (numberOfReviewsOfRestaurant + 1)
      ).toFixed(2);

      const newReview = new Review({
        rid,
        dinerId,
        food,
        service,
        ambiance,
        content,
      });
      await newReview.save();
      await restaurant.save();

      let resData = await newReview.populate('dinerId');
      resData = resData.toObject();
      resData.diner = resData.dinerId;
      delete resData.dinerId;

      return res.status(200).send(resData);
    } catch (error) {
      res.status(500).send({ message: 'Something wrong with review restaurant', error });
    }
  },
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { rid, food, service, ambiance, content, dinerId } = req.body;
      const review = await Review.findById(id);
      const restaurant = await Restaurant.findById(rid);
      const numberOfReviewsOfRestaurant = await Review.countDocuments({ rid });

      const prevAvarageRate = (review.food + review.service + review.ambiance) / 3;
      const userAvarageRate = (food + service + ambiance) / 3;

      restaurant.rate = (
        (restaurant.rate * numberOfReviewsOfRestaurant + userAvarageRate - prevAvarageRate) /
        numberOfReviewsOfRestaurant
      ).toFixed(2);

      review.food = food;
      review.service = service;
      review.ambiance = ambiance;
      review.content = content;
      await review.save();
      await restaurant.save();
      console.log('Review updated');

      let resData = await review.populate('dinerId');
      resData = resData.toObject();
      resData.diner = resData.dinerId;
      delete resData.dinerId;

      return res.status(200).send(resData);
    } catch (error) {}
  },
  async deleteReview(req, res) {
    try {
      const user = req.user;
      const { id } = req.params;

      await Review.findOneAndDelete({ _id: id, dinerId: user.id });
      res.status(200).send({ message: 'Review is deleted successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Something wrong with review restaurant', error });
    }
  },
  async getNotifications(req, res) {
    try {
      const user = req.user;
      const { page, sortBy, pageSize, offset } = req.paginator;

      const totalItems = await Notification.countDocuments({
        receiverId: user.id,
      });
      const totalPages = Math.ceil(totalItems / pageSize);
      if (page > totalPages && totalPages !== 0) {
        return res.status(404).send({ message: 'Page not found', totalPages });
      }

      let notifications = await Notification.find({ receiverId: user.id })
        .sort({ createdAt: sortBy })
        .skip(offset)
        .limit(pageSize)
        .populate('senderId');

      notifications = await Promise.all(
        notifications.map(async (item) => {
          item = item.toObject();
          if (item.senderId.isOwner) {
            item.sender = await Restaurant.findOne({ ownerId: item.senderId.id });
          } else {
            item.sender = item.senderId;
          }
          delete item.senderId;
          return item;
        }),
      );

      return res.status(200).send({
        page,
        totalItems,
        totalPages,
        itemsList: notifications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Something wrong with getNotifications',
        error,
      });
    }
  },
  async putNotificationsStatus(req, res) {
    try {
      const { notifIds } = req.body;
      await Notification.updateMany({ _id: { $in: notifIds } }, { $set: { readed: true } });
      res.status(200).send({ message: 'Update notifications status -> readed' });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Something wrong with putNotificationsStatus',
        error,
      });
    }
  },
  async deleteNotifications(req, res) {
    try {
      const { notifIds } = req.body;
      await Notification.deleteMany({ _id: { $in: notifIds } });
      res.status(200).send({ message: 'Delete notification success' });
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  },
  async postChatBox(req, res) {
    try {
      const { senderId, receiverId } = req.body;
      const newConversation = new Conversation({
        uids: [senderId, receiverId],
        messages: [],
        usersReaded: [senderId],
      });
      await newConversation.save();

      res.status(200).send({ chatBoxId: newConversation.id });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with create chatbox', error });
    }
  },

  async getChatBoxes(req, res) {
    try {
      const user = req.user;

      let chatBoxes = await Conversation.find({ uids: { $in: [user.id] } });
      chatBoxes = await Promise.all(
        chatBoxes.map(async (item) => {
          const chatWithUserId = item.uids.filter((id) => id !== user.id);
          let userChatWith;
          if (user.isOwner) {
            userChatWith = await User.findById(chatWithUserId);
          } else {
            userChatWith = await Restaurant.findOne({ ownerId: chatWithUserId }).populate(
              'mainImage',
              'url name',
            );
          }

          return {
            ...item.toObject(),
            userChatWith,
          };
        }),
      );

      res.status(200).send(chatBoxes);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with get chatboxs', error });
    }
  },

  async putReadedMessageStatus(req, res) {
    try {
      const { conversationId, uid } = req.body;
      await Conversation.findByIdAndUpdate(conversationId, { $push: { usersReaded: uid } });
      res.status(200).send({ message: 'readed successfully' });
    } catch (error) {
      console.log(error);
    }
  },

  async updateReservation(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;
      let reservation = await Reservation.findById(id).populate('dinerId').populate('rid');

      if (!reservation) return res.status(404).send({ message: 'Reservation not found' });

      if (payload.request === 'update') {
        const { date, time, size } = payload;
        reservation.versions.unshift({
          time: reservation.time,
          date: reservation.date,
          size: reservation.size,
          status: reservation.status,
          createdAt: reservation.updatedAt,
        });

        reservation.time = time;
        reservation.date = date;
        reservation.size = size;
        reservation.status = 'responding';
      } else if (payload.request === 'cancel') {
        reservation.cancelMessage = { message: payload.cancelMessage, createdAt: new Date() };
        reservation.status = 'canceled';
      }

      await reservation.save();
      reservation = reservation.toObject();
      reservation.diner = reservation.dinerId;
      reservation.restaurant = reservation.rid;
      delete reservation.dinerId;
      delete reservation.rid;

      res.status(200).send(reservation);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with putReservation', error });
    }
  },
};
