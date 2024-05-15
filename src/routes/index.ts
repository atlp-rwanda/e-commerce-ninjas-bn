import { Router } from "express";
import { User } from "../databases/models/User";

const routes = Router();

// Use Routes

routes.get('/add', async(req, res) => {
    const randomNum = Math.floor(Math.random() * 1000);
    const newUser = await User.create({names: `Emmy${randomNum}`, email: `emmy${randomNum}@gmail.com`, password: "P@ssword2024"})
    res.status(201).json({status: true, message: "User registerd", user: newUser})
});

routes.get('/users', async(req, res) => {
    res.status(201).json({status: true, message: await User.findAll() })
});

export default routes;
