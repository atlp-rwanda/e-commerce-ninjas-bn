import cron from "node-cron";
import updateExpiredProducts from "../helpers/updateExpiredProducts";
import { Request, Response } from "express";

const cronSchedule = "* * * * *";

export const startCronJobMiddleware = () => {
  cron.schedule(cronSchedule, async () => {
    try {
      const req = {} as Request;
      const res = {} as Response;
      console.log("am cronning all products...");
      await updateExpiredProducts(req, res);
    } catch (error) {
      console.error("Error updating expired products:", error);
    }
  });
};
