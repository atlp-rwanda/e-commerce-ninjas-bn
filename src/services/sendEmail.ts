import nodemailer, { SendMailOptions } from "nodemailer";
import dotenv from "dotenv";
import authRepository from "../modules/auth/repository/authRepositories";

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

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sendEmailNotification = async (userId: string, message: string) => {
  try {
    const user = await authRepository.findUserByAttributes("id", userId);
    
    if (!user || !user.email) {
      throw new Error("User not found or user does not have a valid email address");
    }

    const mailOptions: SendMailOptions = {
      from: process.env.MAIL_ID,
      to: user.email,
      subject: "Ninja E-commerce",
      text: message
    };

    console.log("Sending email with options:", mailOptions);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", user.email);
        break;
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          console.error("Final attempt failed:", error.message);
          throw new Error(`Failed to send email after ${MAX_RETRIES} attempts: ${error.message}`);
        } else {
          console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${RETRY_DELAY_MS}ms...`);
          await delay(RETRY_DELAY_MS);
        }
      }
    }
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const sendEmail = async (email: string, subject: string, message: string, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
      try {
          const mailOptionsVerify: SendMailOptions = {
              from: process.env.MAIL_ID,
              to: email,
              subject: subject,
              html: message
          };
      
          await transporter.sendMail(mailOptionsVerify);
          console.log("Email sent successfully");
          break;
      } catch (error) {
          attempt++;
          console.error(`Attempt ${attempt} failed: ${error.message}`);
          if (attempt >= retries) {
              throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`);
          }
      }
  }
};

const sendEmailOrderStatus = async (userId: string, message: string, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
      try {
          const user = await authRepository.findUserByAttributes("id", userId);
          const mailOptions: SendMailOptions = {
              from: process.env.MAIL_ID,
              to: user.email,
              subject: "Order notification",
              text: message
          };
      
          await transporter.sendMail(mailOptions);
          console.log("Order status email sent successfully");
          break;
      } catch (error) {
          attempt++;
          console.error(`Attempt ${attempt} failed: ${error.message}`);
          if (attempt >= retries) {
              throw new Error(`Failed to send order status email after ${retries} attempts: ${error.message}`);
          }
      }
  }
};

export {  sendEmail, transporter, sendEmailNotification, sendEmailOrderStatus };