import cron from "node-cron";
import { Op } from "sequelize";
import { addDays } from "date-fns";
import Users from "../databases/models/users";
import { sendEmail } from "../services/sendEmail";

const PASSWORD_EXPIRATION_DAYS = Number(process.env.PASSWORD_EXPIRATION_DAYS);

export const checkPasswordExpirations = async () => {
  const now = new Date();

  try {
    const users = await Users.findAll({
      where: {
        updatedAt: {
          [Op.lte]: addDays(now, -PASSWORD_EXPIRATION_DAYS)
        },
        isVerified: true,
        status: "enabled"
      }
    });

    for (const user of users) {
      const emailMessage = `Dear ${user.email}, your password has expired. Please update your password to continue using the E-commerce Ninja.`;
      await sendEmail(user.email, "Password Expiration Notice", emailMessage)
        .then(() => console.log(`Notification sent to user: ${user.email}`))
        .catch((err) =>
          console.error(`Failed to send email to ${user.email}:`, err.message)
        );
    }
    
    console.log(`${users.length} users notified for password expiration.`);
  } catch (error) {
    console.error("Error checking password expiration:", error);
  }
};


cron.schedule("* * * * *", checkPasswordExpirations);
