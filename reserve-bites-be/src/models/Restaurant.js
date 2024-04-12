import mongoose from '../config/mongoose.config.js';

const Schema = mongoose.Schema;

export const AddressSchema = new Schema(
  {
    detail: { type: String, required: true },
    country: { type: String, required: true },
    province: { type: String, required: true },
  },
  { versionKey: false },
);

const DishSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { versionKey: false },
);

const MenuSchema = new Schema(
  {
    dishes: { type: [DishSchema], required: true },
    category: { type: String, required: true },
  },
  { versionKey: false },
);

const OperationTimeSchema = new Schema(
  {
    openDay: { type: [String], required: true },
    openTime: { type: Date, required: true, default: new Date() },
    closeTime: { type: Date, required: true, default: new Date() },
  },
  { versionKey: false },
);

const RestaurantShcema = new Schema(
  {
    owner: { type: String, required: true, ref: 'user' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    currency: { type: String, required: true },
    menu: { type: [MenuSchema], required: true },
    operationTime: { type: OperationTimeSchema, required: true },
    maxReservationSize: { type: Number, required: true },
    mainImage: { type: String, required: true, ref: 'image' },
    gallery: { type: [String], required: true, ref: 'image' },
    rate: { type: Number, default: 0 },
    cuisines: [String],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('restaurant', RestaurantShcema);
