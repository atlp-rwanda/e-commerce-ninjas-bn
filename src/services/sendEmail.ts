import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendForgotPasswordEmail = async (email: string, token: string, firstName: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset - E-Commerce Ninjas",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="color: #555;">Hello ${firstName},</p>
            <p style="color: #555;">
                You requested a password reset. Please use the following token to reset your password:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; padding: 10px 20px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 5px; font-size: 18px; color: #333;">${token}</span>
            </div>
            <p style="color: #555; margin-top: 20px">
                If you did not request this, please ignore this email and your password will remain unchanged.
            </p>
            <p style="color: #555;margin-top: 40px;">Best Regards,</p>
            <p style="color: #555; margin-top:-2px">E-Commerce Ninjas Team</p>
            <div style="margin-top: 40px; color: #aaa; font-size: 12px;">
                <p>© 2024 E-Commerce Ninjas. All rights reserved.</p>
                <p>Kigali, Rwanda</p>
            </div>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};
