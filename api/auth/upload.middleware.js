import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import multer from "multer";

import { contactModel } from "../contacts/contacts.model";


import { avatar } from "../contacts/createAvatar";
const path = require("path");
import { promises as fsPromises } from "fs";
import { authController } from "./auth.controller";

const SERVER_URL = "http://localhost:1000";
const COMPRESSED_IMAGES_BASE_URL = "images";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    const { ext } = path.parse(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

export async function compressContactAvatar(req, res, next) {
  const { destination, filename } = req.file;
  const COMPRESSED_DESTINATION = "public/images";
  await imagemin([`${destination}/${filename}`], {
    destination: COMPRESSED_DESTINATION,
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  req.file.path = path.join(COMPRESSED_DESTINATION, filename);
  await fsPromises.unlink(`${destination}/${filename}`);
  next();
}

export async function updateContactAvatar(req, res, next) {

 

  const avatarURL = `${SERVER_URL}/${COMPRESSED_IMAGES_BASE_URL}/${req.file}`;
  await contactModel.updateContactById(req.user._id, { avatarURL });

  return res.status(200).json({avatarURL});

}

export async function generateAvatar(req, res, next) {
  const buffer = await avatar.create();

  const avaName = `avatar${Date.now()}.png`;
  const avaPath = path.join(__dirname, `./../../tmp/${avaName}`);

  await fsPromises.writeFile(avaPath, buffer);

  const uncomprssedDestinaton = "tmp";
  const COMPRESSED_DESTINATION = "public/images";

  await imagemin([`${uncomprssedDestinaton}/${avaName}`], {
    destination: COMPRESSED_DESTINATION,
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  req.file = path.join(avaName);
  await fsPromises.unlink(`${uncomprssedDestinaton}/${avaName}`);
  next();
}

export const upload = multer({ storage });
