import { Router } from "express"
import authRouter from "./authRouter"
import userRouter from "./userRouter";
import productRouter from "./productRouter";

const router: Router = Router()

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/collection", productRouter);

export default router;