import bcrypt from 'bcrypt';

import User from '../models/User.js';
import Image from '../models/Image.js';
import Event from '../models/Event.js';
import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';

export default {
  async postRegister(req, res) {
    try {
      console.log('REGISTER RESTAURANT', req.body);

      const { owner, restaurant } = req.body;
      const imageIds = [restaurant.mainImage, ...restaurant.gallery];
      const newUser = new User({
        ...owner,
        password: await bcrypt.hash(owner.password, 10),
        isOwner: true,
      });
      const newRestaurant = new Restaurant({
        ...restaurant,
        owner: newUser.id,
      });

      await newUser.save();
      await newRestaurant.save();
      await Image.updateMany({ _id: { $in: imageIds } }, { $set: { state: 1 } });

      return res.status(200).send({ message: 'Restaurant is registed successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with restaurant register', error });
    }
  },
  async putUpdateRestaurant(req, res) {
    try {
      const owner = req.user;
      const { restaurant, deletedImageIds } = req.body;
      const imageIds = [...([restaurant?.mainImage] || []), ...(restaurant?.gallery || [])];

      await Image.updateMany({ _id: { $in: imageIds } }, { $set: { state: 1 } });
      await Image.deleteMany({ _id: { $in: deletedImageIds } });

      console.log(restaurant);

      let updatedRestaurant = await Restaurant.findOneAndUpdate({ owner: owner.id }, restaurant, {
        new: true,
      })
        .populate('owner')
        .populate('gallery', 'url name')
        .populate('mainImage', 'url name');

      console.log('update restaurant');
      if (updatedRestaurant) {
        return res.status(200).send(updatedRestaurant.toObject());
      } else {
        return res.status(404).send({ message: 'Restaurant Not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with restaurant update', error });
    }
  },
  async getInfo(req, res) {
    try {
      const { id } = req.params;

      // find restaurant by id
      let restaurant = await Restaurant.findById(id)
        .populate('owner')
        .populate('gallery', 'url name')
        .populate('mainImage', 'url name');

      if (!restaurant) {
        return res.status(404).send({ message: 'Restaurant not found' });
      }

      const events = await Event.find({ restaurant: id }).populate('poster', 'url name');

      if (restaurant) {
        return res
          .status(200)
          .send({ ...restaurant.toObject(), events: events.map((item) => item.toObject()) });
      } else {
        return res.status(404).send({ message: 'Restaurant Not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with get restaurant info', error });
    }
  },
  async getTopRestaurant(req, res) {
    try {
      const restaurants = await Restaurant.find({})
        .sort([['rate', 'desc']])
        .limit(4)
        .populate('mainImage', 'url name');

      return res.status(200).send(restaurants);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Something wrong with get suggest restaurants',
        error,
      });
    }
  },
  async getSuggestForUser(req, res) {
    try {
      const { favoriteCuisines } = req.user.toObject();

      if (favoriteCuisines.length > 0) {
        const restaurants = await Restaurant.aggregate([
          {
            $addFields: {
              id: '$_id',
              mainImage: { $toObjectId: '$mainImage' },
              combineCuisines: {
                $reduce: {
                  input: '$cuisines',
                  initialValue: '',
                  in: { $concat: ['$$value', ' ', '$$this'] },
                },
              },
            },
          },
          {
            $match: {
              $or: favoriteCuisines.map((value) => ({
                combineCuisines: { $regex: new RegExp(value, 'i') },
              })),
            },
          },
          {
            $lookup: {
              from: 'images',
              localField: 'mainImage',
              foreignField: '_id',
              as: 'mainImageArray',
            },
          },
          {
            $addFields: {
              mainImage: { $arrayElemAt: ['$mainImageArray', 0] },
            },
          },
          {
            $project: {
              _id: 0,
              mainImageArray: 0,
              combineCuisines: 0,
            },
          },
          { $limit: 8 },
        ]);
        return res.status(200).send(restaurants);
      } else {
        return res.status(403).send({ message: "Dont have user's favoriteCuisines" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with get suggest for user', error });
    }
  },
  async geLocalRestaurants(req, res) {
    try {
      const { address } = req.user;

      if (address) {
        const restaurants = await Restaurant.find({
          'address.country': { $regex: address, $options: 'i' },
        })
          .limit(8)
          .populate('mainImage', 'url name');

        return res.status(200).send(restaurants);
      } else {
        return res.status(403).send({ message: "Dont have user's address" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with get Local restaurants', error });
    }
  },
  async getReviews(req, res) {
    try {
      const { id: rid } = req.params;
      const { uid } = req.query;
      const { page, sortBy, pageSize, offset } = req.paginator;

      const totalItems = await Review.countDocuments({ restaurant: rid });
      const totalPages = Math.ceil(totalItems / pageSize);
      if (page > totalPages && totalPages !== 0) {
        return res.status(404).send({ message: 'Page not found', totalPages });
      }

      let userReview =
        (await Review.find({ restaurant: rid, diner: uid }).populate('diner'))[0] || null;
      if (userReview) {
        userReview = userReview.toObject();
      }

      const reviews = await Review.find({ restaurant: rid, diner: { $ne: uid } })
        .sort({ createdAt: sortBy })
        .skip(offset)
        .limit(pageSize)
        .populate('diner');

      console.log(reviews);

      const formattedreviewsList = reviews.map((r) => {
        return r.toObject();
      });

      console.log('Get reviews');
      return res.status(200).send({
        page,
        totalItems,
        totalPages,
        itemsList: formattedreviewsList,
        userItem: userReview,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'something wrong with get reviews', error });
    }
  },
  async getRestaurantReservations(req, res) {
    const rid = req.params.id;
    const { text, status } = req.query;
    const { page, sortBy, pageSize, offset } = req.paginator;

    const users = await User.find({
      $or: [
        { firstName: { $regex: text, $options: 'i' } },
        { lastName: { $regex: text, $options: 'i' } },
        { email: { $regex: text, $options: 'i' } },
      ],
    }).select('id');
    const userIds = users.map((user) => user.id);
    const countConditions = {
      restaurant: rid,
      diner: { $in: userIds },
    };
    const listConditions = {
      restaurant: rid,
      diner: { $in: userIds },
      ...(status ? { status } : {}),
    };
    const totalItems = await Reservation.countDocuments(countConditions);
    const totalPages = Math.ceil(totalItems / pageSize);
    if (page > totalPages && totalPages !== 0) {
      return res.status(404).send({ message: 'Page not found', totalPages });
    }

    const reservationsList = await Reservation.find(listConditions)
      .sort({ createdAt: sortBy })
      .skip(offset)
      .limit(pageSize)
      .populate('diner');

    const formattedReservationsList = reservationsList.map((reservation) => {
      return reservation.toObject();
    });

    return res.status(200).send({
      page,
      totalItems,
      totalPages,
      itemsList: formattedReservationsList,
    });
  },
  async getLocations(req, res) {
    try {
      const locations = await Restaurant.find().distinct('address.country');
      console.log('get locations[]');
      return res.status(200).send({ locations });
    } catch (error) {
      console.log(error);
      res.status(500).jjson({ message: 'Something wrong with get locations' });
    }
  },
  async search(req, res) {
    try {
      let { name, address, openDay, rate, size, cuisines, page } = req.query;
      // console.log('search', { name, address, openDay, rate, size });
      page = Number(page) || 1;
      const pageSize = 10;
      const offset = (page - 1) * pageSize;
      const [minRate, maxRate] = rate.split(',');

      const condition = [
        {
          $addFields: {
            combinedAddress: {
              $concat: ['$address.detail', ', ', '$address.province', ', ', '$address.country'],
            },
            owner: { $toObjectId: '$owner' },
            mainImage: { $toObjectId: '$mainImage' },
          },
        },
        {
          $match: {
            name: { $regex: name, $options: 'i' },
            combinedAddress: { $regex: address, $options: 'i' },
            rate: { $gte: Number(minRate), $lte: Number(maxRate) },
            maxReservationSize: { $gte: Number(size) },
            // cuisines: { $in: cuisines || [] },
            ...(openDay ? { 'operationTime.openDay': { $in: [openDay] } } : {}),
          },
        },
        {
          $lookup: {
            from: 'images',
            localField: 'mainImage',
            foreignField: '_id',
            as: 'mainImage',
          },
        },
        {
          $lookup: {
            from: 'users', // Assuming 'owners' is the name of your owners collection
            localField: 'owner', // Field in the 'Restaurant' collection
            foreignField: '_id', // Field in the 'owners' collection
            as: 'owner', // New field that will contain the owner information
          },
        },
      ];

      const count = await Restaurant.aggregate([...condition, { $count: 'totalItems' }]);
      const totalItems = count.length > 0 ? count[0].totalItems : 0;

      const totalPages = Math.ceil(totalItems / pageSize);
      if (page > totalPages && totalPages !== 0) {
        return res.status(404).send({ message: 'Page not found', totalPages });
      }

      const results = await Restaurant.aggregate([...condition, { $skip: offset }]);

      return res.status(200).send({
        page,
        totalItems,
        totalPages,
        itemsList: results.map((item) => ({
          ...item,
          mainImage: item.mainImage[0],
        })),
      });
    } catch (error) {
      console.log(error);
      res.status(500).status({ message: 'Something wrong with search' });
    }
  },
  async getReservation(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      let reservation = await Reservation.findById(id).populate('restaurant').populate('diner');

      if (reservation) {
        reservation = reservation.toObject();

        res.status(200).send(reservation);
      } else {
        res.status(404).send({ message: `Reservation ${id} not found` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with get reservation by id' });
    }
  },
  async responseReservation(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const reservation = await Reservation.findById(id);
      if (reservation) {
        reservation.status = status;
        await reservation.save();
        return res.status(200).send(reservation.toObject());
      }

      res
        .status(409)
        .send({ message: `Can not modified reservation have status ${reservation.status}` });
    } catch (error) {
      console.log(error);
      res.status(200).send({ message: 'Something wrong with responseReservation', error });
    }
  },
  async postRestaurantEvent(req, res) {
    try {
      const { name, desc, endDate, poster, rid } = req.body.payload;
      const event = new Event({ name, desc, endDate, poster, restaurant: rid });
      await Image.updateMany({ _id: poster }, { $set: { state: 1 } });
      await event.save();
      res.status(200).send(event.toObject());
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with postRestaurantEvent', error });
    }
  },
  async getEvents(req, res) {
    try {
      const events = await Event.find({})
        .sort({ createdAt: 'desc' })
        .limit(5)
        .populate('restaurant')
        .populate('poster', 'url name');

      res.status(200).send(events);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something wrong with getEvents', error });
    }
  },
};
