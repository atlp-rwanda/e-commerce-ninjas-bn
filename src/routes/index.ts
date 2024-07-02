import { Router } from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import productRouter from "./productRouter";
import cartRouter from "./cartRouter";
const router: Router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/shop", productRouter);
router.use("/cart", cartRouter);

export default router;