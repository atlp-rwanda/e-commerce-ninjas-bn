import express from "express";
import { disableUser, enableUser} from "../modules/user/controller/userControllers";

const router = express.Router();


router.put("/disable/:id", disableUser);


router.put("/enable/:id", enableUser);

export default router;