import { Op } from "sequelize";
import Users from "../databases/models/users";
import { eventEmitter } from "./notifications";

const PASSWORD_EXPIRATION_MINUTES = Number(process.env.PASSWORD_EXPIRATION_MINUTES) || 90;
const EXPIRATION_GRACE_PERIOD_MINUTES = 1;

const WARNING_INTERVALS = [4,3,2,1];

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
    for (const interval of WARNING_INTERVALS) {
      const usersToWarn = await Users.findAll({
        where: {
          passwordUpdatedAt: {
            [Op.between]: [
              subtractMinutes(now, PASSWORD_EXPIRATION_MINUTES - interval),
              subtractMinutes(now, PASSWORD_EXPIRATION_MINUTES - interval - 1)
            ]
          },
          isVerified: true,
          status: "enabled",
          isGoogleAccount: false
        }
      });

      for (const user of usersToWarn) {
        const salutation = getSalutation(user.lastName);
        const emailMessage = `${salutation}, your password will expire in ${interval} minutes. Please update your password to continue using the platform.`;
        eventEmitter.emit("passwordExpiry", { userId: user.id, message: emailMessage, minutes: interval });
      }

      // console.log(`${usersToWarn.length} users warned for ${interval}-minute password expiration.`);
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
        status: "enabled",
        isGoogleAccount: false
      }
    });

    for (const user of usersToNotifyExpired) {
      const salutation = getSalutation(user.lastName);
      const emailMessage = `${salutation}, your password has expired. Please update your password to continue using the platform.`;
      eventEmitter.emit("passwordExpiry", { userId: user.id, message: emailMessage, minutes: 0 });
    }

    // console.log(`${usersToNotifyExpired.length} users notified for password expiration.`);

  } catch (error) {
    console.error("Error checking password expiration:", error);
  }
};

