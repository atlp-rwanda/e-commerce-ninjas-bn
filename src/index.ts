import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import SwaggerUi from "swagger-ui-express";
import Document from "../swagger.json";

dotenv.config();
const app: Express = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan(process.env.NODE));
app.use(compression());
app.use(cors());
app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(Document));

app.get("/", (req: Request, res: Response) => {
  console.log("Index using PORT: ", PORT)
  res
    .status(200)
    .json({ status: true, message: "Welcome to the e-Commerce-Ninja BackEnd" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;