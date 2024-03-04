import cron from 'node-cron';
import { getStorage, ref, deleteObject } from 'firebase/storage';

import Image from '../models/Image.js';

// delete image with status 0 every day at 2:00
cron.schedule(
  '0 2 * * *',
  async () => {
    const files = await Image.find({ state: 0 });
    await Image.deleteMany({ state: 0 });
    const storage = getStorage();
    for (let file of files) {
      const fileRef = ref(storage, `images/${file.name}`);
      deleteObject(fileRef);
    }
    console.log('Deleted images state 0');
  },
  {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
  },
);
