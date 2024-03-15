import User from '../models/User.js';
import bcrypt from 'bcrypt';

import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Notification from '../models/Notification.js';

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

      notifications = notifications.map((item) => {
        item = item.toObject();
        item.sender = item.senderId;
        delete item.senderId;
        return item;
      });

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
};
