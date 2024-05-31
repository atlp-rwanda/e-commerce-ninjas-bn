/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config
const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};

const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export { generateToken, verifyToken, hashPassword}

