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

const sendResetPasswordEmail = async (email: string, subject: string, message: string) => {
    try {
        const mailOptionsReset: SendMailOptions = {
            from: process.env.MAIL_ID,
            to: email,
            subject: subject,
            text: message
        };

        await transporter.sendMail(mailOptionsReset);
    } catch (error) {
        throw new Error(error.message);
    }
};

export { sendResetPasswordEmail, transporter };
