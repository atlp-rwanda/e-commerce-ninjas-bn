/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import nodemailer, { SendMailOptions } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email: string, subject: string, message: string) => {
    try {
        const mailOptionsVerify: SendMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message
        };
    
        await transporter.sendMail(mailOptionsVerify);
    } catch (error) {
        throw new Error(error.message);
    }
};

const sendResetPasswordEmail = async (email: string, subject: string, message: string) => {
    try {
        const mailOptionsReset: SendMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message
        };

        await transporter.sendMail(mailOptionsReset);
    } catch (error) {
        throw new Error(error.message);
    }
};

export { sendVerificationEmail, sendResetPasswordEmail, transporter };
