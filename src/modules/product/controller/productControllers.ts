/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"
import httpStatus from "http-status";


const paginatedProducts = async (req: any, res: Response) => {
  try {
      const results = req.paginationResults;
      return res.json({ status: httpStatus.OK, data: results });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};

export default { paginatedProducts }