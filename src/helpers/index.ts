import bcrypt from "bcrypt";
import crypto from "crypto";

export const generateResetToken = (): string => {
    return crypto.randomBytes(8).toString("hex");
};



export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
};


