import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config

 const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  };

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds)
};

export { generateToken, verifyToken, hashPassword}

