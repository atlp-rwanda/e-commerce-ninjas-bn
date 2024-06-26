import cron from "node-cron";
import updateExpiredProducts from "../helpers/updateExpiredProducts";
import { checkPasswordExpirations } from "../helpers/passwordExpiryNotifications";

cron.schedule(
  "0 6 * * *",
  async () => {
    try {
      console.log("Cron Job Started..");
      await updateExpiredProducts();
      await checkPasswordExpirations();
    } catch (error) {
      console.error(`Something wrong occurred " ${error.toString()} "`);
    }
  },
  { scheduled: true, timezone: "Asia/Kolkata" }
);

