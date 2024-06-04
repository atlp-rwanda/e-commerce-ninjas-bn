import { Router } from "express";
import productControllers from "../modules/product/controller/productControllers";
import { validation } from "../middlewares/validation";
import { statisticsSchema } from "../modules/product/validation/productValidations";

const router: Router = Router()

router.post("/statistics", validation(statisticsSchema), productControllers.getSellerStatistics)

export default router;