import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const generateResetToken = (): string => {
    return crypto.randomBytes(8).toString("hex");
};

export const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
};


