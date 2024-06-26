"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_HOST_PORT),
    secure: true,
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MP
    }
});
exports.transporter = transporter;
const sendEmail = async (email, subject, message) => {
    try {
        const mailOptionsVerify = {
            from: process.env.MAIL_ID,
            to: email,
            subject: subject,
            text: message
        };
        await transporter.sendMail(mailOptionsVerify);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map