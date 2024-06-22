import { Op } from "sequelize";
import Users from "../databases/models/users";
import { sendEmail } from "../services/sendEmail";

const PASSWORD_EXPIRATION_MINUTES = Number(process.env.PASSWORD_EXPIRATION_MINUTES) || 90;
const WARNING_MINUTES_TEN = 10;
const WARNING_MINUTES_FIVE = 5;
const EXPIRATION_GRACE_PERIOD_MINUTES = 2;
const PASSWORD_RESET_URL = `${process.env.SERVER_URL_PRO}/api/auth/forget-password`;

const subtractMinutes = (date: Date, minutes: number) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - minutes);
  return result;
};

const getSalutation = (lastName: string | null): string => {
  if (lastName) {
    return `Dear ${lastName}`;
  }
  return "Dear";
};

export const checkPasswordExpirations = async () => {
  const now = new Date();

  try {
    const usersToWarnTenMinutes = await Users.findAll({
      where: {
        passwordUpdatedAt: {
          [Op.between]: [
            subtractMinutes(now, PASSWORD_EXPIRATION_MINUTES - WARNING_MINUTES_TEN),
            subtractMinutes(now, PASSWORD_EXPIRATION_MINUTES - WARNING_MINUTES_TEN - 1)
          ]
        },
        isVerified: true,
        status: "enabled"
      }
    });

    for (const user of usersToWarnTenMinutes) {
      const salutation = getSalutation(user.lastName);
      const emailMessage = `${salutation}, your password will expire in 10 minutes. Please update your password to continue using the E-commerce Ninja. You can reset your password using the following link: ${PASSWORD_RESET_URL}`;
      await sendEmail(user.email, "Password Expiration Warning", emailMessage)
        // .then(() => console.log(`10-minute warning sent to user: ${user.email}`))
        .catch((err) =>
          console.error(`Failed to send 10-minute warning to ${user.email}:`, err.message)
        );
    }

    const usersToWarnFiveMinutes = await Users.findAll({
      where: {
        passwordUpdatedAt: {
          [Op.between]: [
            subtractMinutes(now, PASSWORD_EXPIRATION_MINUTES - WARNING_MINUTES_FIVE),
            subtractMinutes(now, PASSWORD_EXPIRATION_MINUTES - WARNING_MINUTES_FIVE - 1)
          ]
        },
        isVerified: true,
        status: "enabled"
      }
    });

    for (const user of usersToWarnFiveMinutes) {
      const salutation = getSalutation(user.lastName);
      const emailMessage = `${salutation}, your password will expire in 5 minutes. Please update your password to continue using the E-commerce Ninja. You can reset your password using the following link: ${PASSWORD_RESET_URL}`;
      await sendEmail(user.email, "Password Expiration Warning", emailMessage)
        // .then(() => console.log(`5-minute warning sent to user: ${user.email}`))
        .catch((err) =>
          console.error(`Failed to send 5-minute warning to ${user.email}:`, err.message)
        );
    }

    const usersToNotifyExpired = await Users.findAll({
      where: {
        passwordUpdatedAt: {
          [Op.between]: [
            subtractMinutes(now, PASSWORD_EXPIRATION_MINUTES + EXPIRATION_GRACE_PERIOD_MINUTES),
            subtractMinutes(now, PASSWORD_EXPIRATION_MINUTES)
          ]
        },
        isVerified: true,
        status: "enabled"
      }
    });

    for (const user of usersToNotifyExpired) {
      const salutation = getSalutation(user.lastName);
      const emailMessage = `${salutation}, your password has expired. Please update your password to continue using the E-commerce Ninja. You can reset your password using the following link: ${PASSWORD_RESET_URL}`;
      await sendEmail(user.email, "Password Expiration Notice", emailMessage)
        // .then(() => console.log(`Expiration notice sent to user: ${user.email}`))
        .catch((err) =>
          console.error(`Failed to send expiration notice to ${user.email}:`, err.message)
        );
    }

    // console.log(`${usersToWarnTenMinutes.length} users warned for 10-minute password expiration.`);
    // console.log(`${usersToWarnFiveMinutes.length} users warned for 5-minute password expiration.`);
    // console.log(`${usersToNotifyExpired.length} users notified for password expiration.`);
  } catch (error) {
    console.error("Error checking password expiration:", error);
  }
};

