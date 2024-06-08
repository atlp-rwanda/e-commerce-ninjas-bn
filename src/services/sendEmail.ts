/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import nodemailer, { SendMailOptions } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_HOST_PORT),
    secure: true,
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MP
    }
});

const sendVerificationEmail = async(email: string, subject: string, message: string) => {
    try {
        const mailOptionsVerify: SendMailOptions = {
            from: process.env.MAIL_ID,
            to: email,
            subject: subject,
            text: message
        };
    
        await transporter.sendMail(mailOptionsVerify);
    } catch (error) {
        throw new Error(error);
    }
};

export {  sendVerificationEmail, transporter };