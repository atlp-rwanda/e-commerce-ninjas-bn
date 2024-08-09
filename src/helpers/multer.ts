/* eslint-disable */
import multer from "multer";
import path from "path";
import { Request } from "express";

export const fileFilter = (req: Request, file: Express.Multer.File, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.tiff','.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
};

const storage = multer.diskStorage({});

const multerConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

export default multerConfig;