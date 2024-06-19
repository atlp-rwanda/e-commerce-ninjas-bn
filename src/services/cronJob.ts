import cron from "node-cron";
import updateExpiredProducts from "../helpers/updateExpiredProducts";
import { Request, Response } from "express";
import httpStatus from "http-status";



const cronSchedule = "0 6 * * *";

export const startCronJobMiddleware = () => {
      const req = {} as Request;
      const res = {} as Response;
  cron.schedule(cronSchedule, async () => {
    try {
      await updateExpiredProducts(req, res);
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: error.message
      });
    }
  });
};
