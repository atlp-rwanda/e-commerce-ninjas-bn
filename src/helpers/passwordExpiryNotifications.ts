import { Op } from "sequelize";
import Users from "../databases/models/users";
import Settings from "../databases/models/settings";
import { eventEmitter } from "./notifications";

const EXPIRATION_GRACE_PERIOD_MINUTES = 1;
const WARNING_INTERVALS = [4, 3, 2, 1];

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
  console.log("Starting password expiration check...");

  const now = new Date();
  
  const setting = await Settings.findOne({ where: { key: "PASSWORD_EXPIRATION_MINUTES" } });
  const PASSWORD_EXPIRATION_MINUTES = setting ? Number(setting.value) : 90;

  console.log(`PASSWORD_EXPIRATION_MINUTES: ${PASSWORD_EXPIRATION_MINUTES}`);

  try {
    for (const interval of WARNING_INTERVALS) {
      console.log(`Checking for users to warn with ${interval} minutes remaining...`);

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
          isGoogleAccount: false,
          role: { [Op.in]: ["buyer", "seller"] } // Filter by role
        }
      });

      console.log(`Found ${usersToWarn.length} users to warn with ${interval} minutes remaining.`);

      for (const user of usersToWarn) {
        const salutation = getSalutation(user.lastName);
        const emailMessage = `${salutation}, your password will expire in ${interval} minutes. Please update your password to continue using the platform.`;

        console.log(`Sending warning to user ID: ${user.id}, Interval: ${interval} minutes`);
        eventEmitter.emit("passwordExpiry", { userId: user.id, message: emailMessage, minutes: interval });
      }
    }

    console.log("Checking for users whose password has expired...");

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
        isGoogleAccount: false,
        role: { [Op.in]: ["buyer", "seller"] } // Filter by role
      }
    });

    console.log(`Found ${usersToNotifyExpired.length} users whose password has expired.`);

    for (const user of usersToNotifyExpired) {
      const salutation = getSalutation(user.lastName);
      const emailMessage = `${salutation}, your password has expired. Please update your password to continue using the platform.`;

      console.log(`Sending expiration notice to user ID: ${user.id}`);
      eventEmitter.emit("passwordExpiry", { userId: user.id, message: emailMessage, minutes: 0 });
    }

  } catch (error) {
    console.error("Error checking password expiration:", error);
  }

  console.log("Password expiration check completed.");
};
