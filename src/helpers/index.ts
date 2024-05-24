import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
dotenv.config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
 const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  };
  export { generateToken,cloudinary}