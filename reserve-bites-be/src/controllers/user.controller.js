import User from "../models/User.js";
import bcrypt from "bcrypt";
import Restaurant from "../models/Restaurant.js";
import Reservation from "../models/Reservation.js";

export default {
  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = id === "me" ? req.user : await User.findById(id);
      let rid = undefined;
      console.log(user.id)

      if (user.isOwner) {
        const restaurant = await Restaurant.findOne({ ownerId: user.id })
        rid = restaurant.id;
      }
      const { password, ...safeInfo } = user.toObject();

      console.log('get user' + user.id);
      return res.status(200).send({
        ...safeInfo,
        ...(rid ? { rid } : {})
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something wrong with get user" });
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
      res.status(500).send({ message: "Something wrong with change info" });
    }
  },
  async putChangePassword(req, res) {
    try {
      const user = await User.findById(req.user.id).select("+password");
      const { oldPassword, newPassword } = req.body;

      const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidOldPassword) return res.status(403).send({ message: "Old password is not correct" });

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      console.log('Update password ' + user.id);
      return res.status(200).send({ message: "Change password success" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something wrong with change password", error });
    }
  },
  async postReservation(req, res) {
    try {
      const payload = req.body;
      const newReservation = new Reservation(payload);
      await newReservation.save();
      return res.status(200).send({ reservationId: newReservation.id });
    } catch (error) {
      res.status(500).send({ message: "Something wrong with get reserve restaurant", error });
    }
  },
  async getUserReservations(req, res) {
    try {
      const user = req.user;
      const { page, sortBy, pageSize, offset } = req.paginator;
      console.log(user.id)

      const totalItems = await Reservation.countDocuments({ dinerId: user.id });
      const totalPages = Math.ceil(totalItems / pageSize);
      if (page > totalPages && totalPages !== 0) {
        return res.status(404).send({ message: "Page not found", totalPages });
      }

      let reservations = await Reservation.find({ dinerId: user.id })
        .sort({ createdAt: sortBy })
        .skip(offset)
        .limit(pageSize)
        .populate("rid");

      console.log("get reservations[]");

      if (reservations) {
        reservations = reservations.map(item => {
          item = item.toObject();
          item.restaurant = item.rid.name;
          delete item.rid;
          return item;
        })

        console.log(reservations)
        return res.status(200).send({
          page,
          totalItems,
          totalPages,
          itemsList: reservations,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something wrong with get users reservations", error });
    }
  },
};
