import express from "express";
import userControllers from "../modules/user/controller/userControllers";

const router = express.Router();

router.put("/update-user-status/:id", userControllers.updateUserStatus);

export default router;
