import mongoose from 'mongoose';

export function connectDb() {
  mongoose
    .connect(
      'mongodb+srv://phatndt268:0NxeaAMA6oGmPe8H@booking-restaurant.g4ozd00.mongodb.net/',
    )
    .then(() => console.log('Connected to mongoDb'));
}

mongoose.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Transform the "_id" field to "id" in the output
    ret.id = ret._id;
    delete ret._id;
  },
});

mongoose.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    // Transform the "_id" field to "id" in the output
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose;
