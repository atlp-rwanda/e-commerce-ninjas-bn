import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import SwaggerUi from "swagger-ui-express";
import Document from "../swagger.json";
import { SequelizeConnection } from "./databases/models";
import User from "./databases/models/user";

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT;

//? database connection
SequelizeConnection.getInstance();

app.use(express.json());
// app.use(morgan(process.env.NODE_ENV));
app.use(compression());
app.use(cors());
app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(Document));

app.get("/", (req: Request, res: Response) => {
  console.log("Index using PORT: ", PORT);
  res
    .status(200)
    .json({ status: true, message: "Welcome To e-Commerce Ninja BackEnd." });
});

app.get("/api/users", async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({
    ok: true,
    status: "success",
    message: "Got all users",
    data: users,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
