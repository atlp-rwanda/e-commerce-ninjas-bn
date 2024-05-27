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

// const sendEmail = async (req: Request, res: Response) => {
//     const name = req.body.userName;
//     const email = req.body.email;
//     const subject = req.body.subject;
//     const message = req.body.message;

//     const mailOptionsGmail: SendMailOptions = {
//         from: process.env.MAIL_ID,
//         to: process.env.MAIL_ID,
//         subject: subject,
//         text: `From: ${name}\n\nEmail: ${email}\n\n${message}`
//     };

//     transporter.sendMail(mailOptionsGmail, (error, info) => {
//       if (info) {
//             res.status(200).json({
//                 message: "Email sent successfully"
//             });
//         }
//     });
// };

// const sendEmailToUser = async (req: Request, res: Response) => {
//     const email = req.body.email;
//     const subject = req.body.subject;
//     const message = req.body.message;

//     const mailOptionsGmail: SendMailOptions = {
//         from: process.env.MAIL_ID,
//         to: email,
//         subject: subject,
//         text: message
//     };

//     transporter.sendMail(mailOptionsGmail, (error, info) => {
//         if (info) {
//             res.status(200).json({
//                 message: "Email sent successfully"
//             });
//         }
//     });
// };

const verifyEmail = (email: string, subject: string, message: string) => {
    const mailOptionsVerify: SendMailOptions = {
        from: process.env.MAIL_ID,
        to: email,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptionsVerify);
};

export {  verifyEmail };
