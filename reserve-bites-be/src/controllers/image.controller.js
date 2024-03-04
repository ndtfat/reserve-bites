import {
  ref,
  getStorage,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import Image from '../models/Image.js';

export default {
  async uploadSingleImage(req, res) {
    try {
      const { originalname, mimetype, buffer } = req.file;
      const image = await Image.findOne({
        name: `${originalname} (${new Date().toDateString()})`,
      });

      if (image) return res.status(200).json(image);

      const storage = getStorage();
      const storageRef = ref(
        storage,
        `/images/${originalname} (${new Date().toDateString()})`,
      );
      const metadata = { contentType: mimetype };
      const snapshot = await uploadBytesResumable(storageRef, buffer, metadata);
      const dowloadUrl = await getDownloadURL(snapshot.ref);
      const newImage = new Image({
        url: dowloadUrl,
        name: `${originalname} (${new Date().toDateString()})`,
      });
      await newImage.save();

      return res.status(200).send(newImage.toObject());
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .send({ message: 'Something wrong with upoad main image' });
    }
  },
};
