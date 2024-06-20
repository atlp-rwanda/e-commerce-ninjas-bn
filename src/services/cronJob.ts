import cron from "node-cron";
import updateExpiredProducts from "../helpers/updateExpiredProducts";

cron.schedule(
  "0 6 * * *",
  async () => {
    try {
      console.log("Cron Job Started..");
      await updateExpiredProducts();
    } catch (error) {
      console.error(`Something wrong occured " ${error.toString()} "`);
    }
  },
  { scheduled: true, timezone: "Asia/Kolkata" }
);