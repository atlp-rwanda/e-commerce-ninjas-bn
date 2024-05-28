import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config

 const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  };

  export { generateToken }