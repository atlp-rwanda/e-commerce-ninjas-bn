import { Router } from "express"
import authRouter from "./authRouter"
import userRouter from "./userRouter";
import sellerRouter from "./productRouter";


const router: Router = Router()

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/product", sellerRouter);


export default router;
