import { Router } from "express";
import productControllers from "../modules/product/controller/productControllers";
import { validation } from "../middlewares/validation";
import { statisticsSchema } from "../modules/product/validation/productValidations";
import { userAuthorization } from "../middlewares/authorization";

const router: Router = Router()

router.post("/statistics", validation(statisticsSchema), userAuthorization(["buyer", "seller", "admin"]), productControllers.getSellerStatistics)

export default router;