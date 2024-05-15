import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import SwaggerUi from "swagger-ui-express";
import Document from "../swagger.json";

dotenv.config();
const app: Express = express();

// const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan(process.env.NODE_ENV));
app.use(compression());
app.use(cors());
app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(Document));

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: true, message: "Welcome to E-Commerce-Ninja-BackEnd" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});


export default app;