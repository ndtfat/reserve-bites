import cron from 'node-cron';
import { getStorage, ref, deleteObject } from 'firebase/storage';

import Image from '../models/Image.js';
import Reservation from '../models/Reservation.js';

// delete image with status 0 every day at 2:00
cron.schedule(
  '0 2 * * *',
  async () => {
    console.log('Cron job: delete image state 0');
    const files = await Image.find({ state: 0 });
    await Image.deleteMany({ state: 0 });
    const storage = getStorage();
    for (let file of files) {
      const fileRef = ref(storage, `images/${file.name}`);
      deleteObject(fileRef);
    }
  },
  {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
  },
);

// delete image with status 0 every day at 2:00
cron.schedule(
  '*/1 * * * *',
  async () => {
    try {
      const reservation = await Reservation.updateMany(
        {
          status: { $nin: ['complete', 'expired'] },
          date: { $lt: new Date() },
        },
        { $set: { status: 'expired' } },
      );
      console.log(`Cron job: Update ${reservation.modifiedCount} reservation status exprired`);
    } catch (error) {
      console.log(error);
    }
  },
  {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
  },
);
