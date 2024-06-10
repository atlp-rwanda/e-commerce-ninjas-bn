/* eslint-disable comma-dangle */
import multer from "multer";
import path from "path";
import { Request } from "express";

export const fileFilter = (req: Request, file: Express.Multer.File, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    return cb(new Error("Only images are allowed"));
  }
  cb(null, true);
};

const storage = multer.diskStorage({});

const multerConfig = multer({
  storage,
  fileFilter,
});

export default multerConfig;